import { IAppResponseDTO } from '@/@types/dtos';

export function subscribeToCsvImportEvents(callback: (msg: string | null) => void) {
  return window.api.on('import-csv-end', (result: IAppResponseDTO<null>) => {
    if (!result.success && result.error) {
      callback(result.error.message);
    } else {
      callback(null);
    }
  });
}
