import urllib.request, json

data = json.dumps({"message": "I want to buy some electronics"}).encode("utf-8")
req = urllib.request.Request("http://127.0.0.1:5001/api/apbot/predict", data=data, headers={"Content-Type": "application/json"})

try:
    response = urllib.request.urlopen(req)
    print("Success:", response.read().decode())
except Exception as e:
    print("Error:", e)
