from datetime import date

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from .models import Buku


class BukuAPITests(APITestCase):
    """Integration tests for the authenticated Books API."""    

    list_url = "/api/buku/"

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="reader",
            password="test-password-123",
        )
        self.book = Buku.objects.create(
            title="Bumi Manusia",
            writer="Pramoedya Ananta Toer",
            issued_date=date(1980, 8, 1),
        )
        self.access_token = str(AccessToken.for_user(self.user))

    def authenticate(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.access_token}"
        )

    def test_request_without_authentication_is_rejected(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_request_with_invalid_jwt_is_rejected(self):
        self.client.credentials(HTTP_AUTHORIZATION="Bearer not-a-valid-token")

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_request_with_valid_jwt_is_accepted(self):
        self.authenticate()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_book_list(self):
        self.authenticate()

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["title"], "Bumi Manusia")

    def test_get_book_detail(self):
        self.authenticate()

        response = self.client.get(f"{self.list_url}{self.book.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.book.id)
        self.assertEqual(response.data["writer"], "Pramoedya Ananta Toer")

    def test_create_book(self):
        self.authenticate()
        payload = {
            "title": "Anak Semua Bangsa",
            "writer": "Pramoedya Ananta Toer",
            "issued_date": "1980-12-01",
        }

        response = self.client.post(self.list_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            Buku.objects.filter(
                title="Anak Semua Bangsa",
                issued_date=date(1980, 12, 1),
            ).exists()
        )

    def test_patch_book(self):
        self.authenticate()

        response = self.client.patch(
            f"{self.list_url}{self.book.id}/",
            {"title": "Bumi Manusia (Edisi Baru)"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.book.refresh_from_db()
        self.assertEqual(self.book.title, "Bumi Manusia (Edisi Baru)")

    def test_delete_book(self):
        self.authenticate()
        book_id = self.book.id

        response = self.client.delete(f"{self.list_url}{book_id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Buku.objects.filter(id=book_id).exists())

    def test_invalid_book_data_is_rejected(self):
        self.authenticate()

        response = self.client.post(
            self.list_url,
            {"title": "", "writer": "A Writer"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)
        self.assertEqual(Buku.objects.count(), 1)

    def test_get_missing_book_returns_not_found(self):
        self.authenticate()

        response = self.client.get(f"{self.list_url}999999/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_missing_book_returns_not_found(self):
        self.authenticate()

        response = self.client.patch(
            f"{self.list_url}999999/",
            {"title": "Missing"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_missing_book_returns_not_found(self):
        self.authenticate()

        response = self.client.delete(f"{self.list_url}999999/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
