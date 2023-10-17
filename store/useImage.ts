import { useCallback, useState } from 'react';
import { createClient, Photo, ErrorResponse } from 'pexels';
const { photos: photoClient } = createClient(
  '563492ad6f9170000100000173d22f35229d4424919c5a74dbf15ab0'
);

const isErrorResponse = (result: any): result is ErrorResponse => {
  return !!result.error;
};
export const useImage = () => {
  const [imageSearchResult, setImageSearchResult] = useState<Array<Photo>>([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [hasError, setHasError] = useState(false);
  const getImageBySearchTearm = useCallback(
    async (searchTerm: string) => {
      try {
        const response = await photoClient.search({
          query: searchTerm,
          locale: 'de-DE',
          per_page: 20,
        });
        if (isErrorResponse(response)) {
          setHasError(true);
        } else {
          setImageSearchResult(response.photos);
        }
      } catch (e) {
        console.log({ error: JSON.stringify(e) });
      }
    },
    [setImageSearchResult, setHasError]
  );
  return {
    imageSearchResult,
    getImageBySearchTearm,
  };
};
