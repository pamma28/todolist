import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

export const MimeValidators = (
  control: AbstractControl,
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (!control.value) {
    return Promise.resolve(null);
  }
  const file = control.value as File;
  const reader = new FileReader();
  // tslint:disable-next-line: deprecation
  const readerObserver = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      reader.addEventListener('loadend', () => {
        let header = '';
        const arr = new Uint8Array(reader.result as ArrayBuffer).subarray(0, 4);
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        let isValid = false;
        switch (header) {
          case '89504e47':
            isValid = true;
            break;
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8':
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
        }
        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete();
      });
      reader.readAsArrayBuffer(file);
    },
  );

  return readerObserver;
};
