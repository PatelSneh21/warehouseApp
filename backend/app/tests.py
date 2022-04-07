try: 
  from app import app
  import unittest
except Exception as e:
  print("Error importing App")


#To run:
#Make sure you are in the app folder, not the same folder as init.
# Run the command python -m unittest
class FlaskTest(unittest.TestCase):

  #Check for for server running. This should always be passed
  def test_status(self): 
    tester = app.test_client(self)
    response = tester.get("/status")
    status = response.status_code
    self.assertEqual(status, 200)


  #USER MODULE TESTS:
  #Check that user can sign up
  #MAKE SURE YOU CHANGE USERNAME PRIOR TO RUNNING TEST
  def test_signup(self):
    tester = app.test_client(self)
    testData = {
      "username" : "UserTest",
      "name" : "Sneh Patel",
      "userType" : "Employee",
      "password" : "password"
    }
    response = tester.post('/api/signup', json=testData)
    status = response.status_code
    self.assertEqual(status, 202)

  #Check user can logout
  def test_logout(self):
    tester = app.test_client(self)
    response = tester.get("/api/logout")
    status = response.status_code
    self.assertEqual(status, 200)

  #Test isLoggedIn
  def test_isLoggedIn(self): 
    tester = app.test_client(self)
    response = tester.get("/api/isLoggedIn")
    status = response.status_code
    self.assertEqual(status, 404)

   #Test user login method
  def test_login(self): 
    tester = app.test_client(self)
    testData = {
      "username" : "TestingUser",
      "password" : "password",
      "rememberMe" : True

    }
    response = tester.post('/api/login', json=testData)
    status = response.status_code
    self.assertEqual(status, 200)

  #Delete our test user so it doesn't interfere with the database
  def test_delete(self): 
    tester = app.test_client(self)
    response = tester.delete('/api/deleteUser')
    status = response.status_code
    self.assertEqual(status, 200)

if __name__ == "__main__":
  unittest.main()