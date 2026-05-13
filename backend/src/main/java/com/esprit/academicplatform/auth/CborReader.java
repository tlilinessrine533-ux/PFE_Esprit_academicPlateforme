package com.esprit.academicplatform.auth;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

final class CborReader {

    private final byte[] bytes;
    private int offset;

    CborReader(byte[] bytes) {
        this.bytes = bytes;
    }

    Object read() {
        int initialByte = readUnsignedByte();
        int majorType = (initialByte >> 5) & 0x07;
        int additionalInfo = initialByte & 0x1f;

        return switch (majorType) {
            case 0 -> readLength(additionalInfo);
            case 1 -> -1L - readLength(additionalInfo);
            case 2 -> readByteString(additionalInfo);
            case 3 -> new String(readByteString(additionalInfo), StandardCharsets.UTF_8);
            case 4 -> readArray(additionalInfo);
            case 5 -> readMap(additionalInfo);
            case 6 -> {
                readLength(additionalInfo);
                yield read();
            }
            case 7 -> readSimpleValue(additionalInfo);
            default -> throw new IllegalArgumentException("Type CBOR non pris en charge.");
        };
    }

    int getOffset() {
        return offset;
    }

    private Object readSimpleValue(int additionalInfo) {
        return switch (additionalInfo) {
            case 20 -> Boolean.FALSE;
            case 21 -> Boolean.TRUE;
            case 22, 23 -> null;
            default -> throw new IllegalArgumentException("Valeur CBOR simple non prise en charge.");
        };
    }

    private byte[] readByteString(int additionalInfo) {
        int length = Math.toIntExact(readLength(additionalInfo));
        ensureRemaining(length);
        byte[] value = new byte[length];
        System.arraycopy(bytes, offset, value, 0, length);
        offset += length;
        return value;
    }

    private List<Object> readArray(int additionalInfo) {
        int length = Math.toIntExact(readLength(additionalInfo));
        List<Object> values = new ArrayList<>(length);
        for (int index = 0; index < length; index++) {
            values.add(read());
        }
        return values;
    }

    private Map<Object, Object> readMap(int additionalInfo) {
        int length = Math.toIntExact(readLength(additionalInfo));
        Map<Object, Object> values = new LinkedHashMap<>(length);
        for (int index = 0; index < length; index++) {
            values.put(read(), read());
        }
        return values;
    }

    private long readLength(int additionalInfo) {
        return switch (additionalInfo) {
            case 0, 1, 2, 3, 4, 5, 6, 7,
                8, 9, 10, 11, 12, 13, 14, 15,
                16, 17, 18, 19, 20, 21, 22, 23 -> additionalInfo;
            case 24 -> readUnsignedByte();
            case 25 -> readUnsignedShort();
            case 26 -> readUnsignedInt();
            case 27 -> readLong();
            case 31 -> throw new IllegalArgumentException("Les longueurs CBOR indefinies ne sont pas prises en charge.");
            default -> throw new IllegalArgumentException("Longueur CBOR invalide.");
        };
    }

    private int readUnsignedByte() {
        ensureRemaining(1);
        return bytes[offset++] & 0xff;
    }

    private int readUnsignedShort() {
        ensureRemaining(2);
        int value = ((bytes[offset] & 0xff) << 8) | (bytes[offset + 1] & 0xff);
        offset += 2;
        return value;
    }

    private long readUnsignedInt() {
        ensureRemaining(4);
        long value = ((long) (bytes[offset] & 0xff) << 24)
            | ((long) (bytes[offset + 1] & 0xff) << 16)
            | ((long) (bytes[offset + 2] & 0xff) << 8)
            | (bytes[offset + 3] & 0xffL);
        offset += 4;
        return value;
    }

    private long readLong() {
        ensureRemaining(8);
        long value = 0;
        for (int index = 0; index < 8; index++) {
            value = (value << 8) | (bytes[offset + index] & 0xffL);
        }
        offset += 8;
        return value;
    }

    private void ensureRemaining(int length) {
        if (offset + length > bytes.length) {
            throw new IllegalArgumentException("Flux CBOR tronque.");
        }
    }
}
