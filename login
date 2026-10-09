Command:
curl -sS -c /tmp/bookshop-user1.cookies -w '\nHTTP status: %{http_code}\n' -X POST -H 'Content-Type: application/json' -d '{"username":"option1_user","password":"bookpass123"}' http://localhost:5000/customer/login

Output:
{"message":"User successfully logged in"}
HTTP status: 200