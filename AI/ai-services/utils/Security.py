import hashlib;
from environment import appKeyForNutriai;

def get_appkey_hash():
    return hashlib.sha256(appKeyForNutriai.encode('utf-8')).hexdigest();

def verify_appkey_hash(client_hash):
    server_hash = get_appkey_hash();
    return server_hash == client_hash;
