########################
#### helper methods ####
########################
 
def register(self, username, name, usertype, password):
    return self.app.post(
    '/api/signup',
    data=dict(username=username, name=name, userType=usertype, password=password),
    follow_redirects=True
    )
 
def login(self, username, password, rememberMe):
    return self.app.post(
    '/api/login',
    data=dict(username=username, password=password, rememberMe=rememberMe),
    follow_redirects=True
    )
 
def logout(self):
    return self.app.get(
    '/api/logout',
    follow_redirects=True
    )

def test_valid_user_registration(self):
    response = self.register('Spatel122', 'Sneh Patel', 'Employee', 'password')
    self.assertEqual(response.status_code, 202)
    
def test_invalid_user_registration_(self):
    response = self.register("", "", "", "")
    self.assertIn(response.status_code, 404)

def test_invalid_user_login(self):
    response = self.login('invalid', 'invalid')
    self.assertEqual(response.status_code, 404)

def test_valid_user_login(self):
    response = self.login('Spatel122', 'password')
    self.assertEqual(response.status_code, 200)

def test_user_logged_in(self):
    response = self.register("", "", "", "")
    self.assertIn(response.status_code, 300)