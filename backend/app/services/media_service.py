import cloudinary.uploader

from fastapi import HTTPException
from fastapi import UploadFile
from fastapi import status


class MediaService:

    ALLOWED_CONTENT_TYPES = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    MAX_FILE_SIZE = 5 * 1024 * 1024

    def _validate_image(
        self,
        file: UploadFile,
    ) -> None:

        if file.filename is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No file uploaded.",
            )

        if file.content_type not in self.ALLOWED_CONTENT_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image format.",
            )

        file.file.seek(0, 2)
        size = file.file.tell()
        file.file.seek(0)

        if size > self.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image size exceeds 5 MB.",
            )

    def _upload_image(
        self,
        file: UploadFile,
        folder: str,
    ) -> tuple[str, str]:

        self._validate_image(file)

        try:
            result = cloudinary.uploader.upload(
                file.file,
                folder=folder,
                resource_type="image",
            )

        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload image.",
            )

        return (
            result["secure_url"],
            result["public_id"],
        )

    def _delete_image(
        self,
        public_id: str,
    ) -> None:
        pass

    def upload_avatar(
        self,
        file: UploadFile,
    ) -> tuple[str, str]:
        pass

    def delete_avatar(
        self,
        public_id: str,
    ) -> None:
        pass

    def upload_banner(
        self,
        file: UploadFile,
    ) -> tuple[str, str]:
        pass

    def delete_banner(
        self,
        public_id: str,
    ) -> None:
        pass