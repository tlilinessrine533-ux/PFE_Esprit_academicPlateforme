package com.esprit.academicplatform.auth;

final class Base32Encoding {

    private static final char[] ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".toCharArray();

    private Base32Encoding() {
    }

    static String encode(byte[] data) {
        StringBuilder builder = new StringBuilder((data.length * 8 + 4) / 5);
        int buffer = data[0];
        int nextIndex = 1;
        int bitsLeft = 8;

        while (bitsLeft > 0 || nextIndex < data.length) {
            if (bitsLeft < 5) {
                if (nextIndex < data.length) {
                    buffer <<= 8;
                    buffer |= data[nextIndex++] & 0xff;
                    bitsLeft += 8;
                } else {
                    int pad = 5 - bitsLeft;
                    buffer <<= pad;
                    bitsLeft += pad;
                }
            }

            int alphabetIndex = (buffer >> (bitsLeft - 5)) & 0x1f;
            bitsLeft -= 5;
            builder.append(ALPHABET[alphabetIndex]);
        }

        return builder.toString();
    }

    static byte[] decode(String value) {
        String normalized = value.replace("=", "").replaceAll("\\s+", "").toUpperCase();
        byte[] bytes = new byte[normalized.length() * 5 / 8];
        int buffer = 0;
        int bitsLeft = 0;
        int index = 0;

        for (char character : normalized.toCharArray()) {
            int charValue = decodeCharacter(character);
            buffer <<= 5;
            buffer |= charValue & 0x1f;
            bitsLeft += 5;

            if (bitsLeft >= 8) {
                bytes[index++] = (byte) ((buffer >> (bitsLeft - 8)) & 0xff);
                bitsLeft -= 8;
            }
        }

        return bytes;
    }

    private static int decodeCharacter(char character) {
        if (character >= 'A' && character <= 'Z') {
            return character - 'A';
        }

        if (character >= '2' && character <= '7') {
            return character - '2' + 26;
        }

        throw new IllegalArgumentException("Invalid Base32 character: " + character);
    }
}
