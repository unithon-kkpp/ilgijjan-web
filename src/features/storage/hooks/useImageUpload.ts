import { useMutation } from '@tanstack/react-query'
import { storageApi } from '../api/storageApi'

export function useImageUpload() {
  return useMutation({
    mutationFn: (file: File) => storageApi.upload(file),
  })
}
