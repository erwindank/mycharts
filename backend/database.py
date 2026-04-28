"""
Supabase connection.
Create a free project at https://supabase.com and copy the URL and anon key
into your .env file.
"""
from supabase import create_client, Client
import os

_client: Client | None = None


def get_db() -> Client:
    global _client
    if _client is None:
        url = os.getenv('SUPABASE_URL')
        key = os.getenv('SUPABASE_KEY')
        if not url or not key:
            raise RuntimeError('SUPABASE_URL and SUPABASE_KEY must be set in .env')
        _client = create_client(url, key)
    return _client
