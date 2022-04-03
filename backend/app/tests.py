import unittest


########################
#### helper methods ####
########################

def getStatus(self):
  return self.app.get(
  '/status',
  follow_redirects=True
  )

def register(self, username, name, userType, password):
  return self.app.post(
  '/api/signup',
  data=dict(username=username, name=name, userType=usertype, password=password),
  follow_redirects=True
  )
 
def login(self, username, password):
  return self.app.post(
  '/api/login',
  data=dict(username=username, password=password),
  follow_redirects=True
  )

def isLoggedIn(self):
  return self.app.get(
  '/api/isLoggedIn',
  follow_redirects=True
  )
 
def logout(self):
  return self.app.get(
  '/api/logout',
  follow_redirects=True
  )


########################
#### test methods ####
########################

def test_connection(self):
  response = self.getStatus()
  self.assertEqual(response.status_code, 200)

def test_valid_user_registration(self):
  response = self.register('Spatel22', 'Sneh Patel', 'Employee', 'password')
  self.assertEqual(response.status_code, 202)
  
def test_invalid_user_registration(self):
  response = self.register('', '', '', '')
  self.assertEqual(response.status_code, 404)
  
def test_logout_notloggedin(self):
  response = self.logout()
  self.assertEqual(response.status_code, 300)
  
def test_isLoggedIn(self):
  response = self.isLoggedIn()
  self.assertEqual(response.status_code, 404)
 
def test_invalid_login(self):
  response = self.login('invalid', 'invalid')
  self.assertEqual(response.status_code, 404)
  
def test_valid_login(self):
  response = self.login('Spatel22', 'password')
  self.assertEqual(response.status_code, 200)
  
def test_isLoggedIn(self):
  response = self.isLoggedIn()
  user = {
			"username": Spatel22,
			"userType": Employee
		}
  self.assertEqual(response.status_code, 200)
  self.assertEqual(response.user, user)

def test_logout_whenloggedin(self):
  response = self.logout()
  self.assertEqual(response.status_code, 200)
  
  
