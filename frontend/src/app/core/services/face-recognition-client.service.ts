import { Injectable } from '@angular/core';
import type * as FaceApi from 'face-api.js';

@Injectable({ providedIn: 'root' })
export class FaceRecognitionClientService {
  private modelsPromise: Promise<typeof FaceApi> | null = null;

  isSupported() {
    return typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);
  }

  async ensureReady() {
    if (!this.modelsPromise) {
      this.modelsPromise = this.loadModels();
    }

    return this.modelsPromise;
  }

  async startCamera(videoElement: HTMLVideoElement) {
    if (!this.isSupported()) {
      throw new Error("La camera n'est pas disponible sur cet appareil ou ce navigateur.");
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    });

    videoElement.srcObject = stream;
    videoElement.playsInline = true;
    videoElement.muted = true;

    await new Promise<void>((resolve, reject) => {
      const onLoadedMetadata = () => {
        videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
        void videoElement.play().then(() => resolve()).catch(reject);
      };

      videoElement.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
    });

    return stream;
  }

  stopCamera(stream: MediaStream | null) {
    stream?.getTracks().forEach((track) => track.stop());
  }

  async captureDescriptor(videoElement: HTMLVideoElement) {
    const faceapi = await this.ensureReady();
    const detections = await faceapi
      .detectAllFaces(
        videoElement,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 320,
          scoreThreshold: 0.5
        })
      )
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (detections.length === 0) {
      throw new Error('Aucun visage detecte. Placez-vous bien face a la camera puis recommencez.');
    }

    if (detections.length > 1) {
      throw new Error("Plusieurs visages ont ete detectes. Gardez uniquement une personne dans le cadre.");
    }

    return Array.from(detections[0].descriptor);
  }

  private async loadModels() {
    const faceapi = await import('face-api.js');
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    ]);
    await faceapi.tf.ready();
    return faceapi;
  }
}
