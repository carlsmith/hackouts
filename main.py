#!/usr/bin/env python

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

class MainHandler(webapp.RequestHandler):
    
    def get(self):
        
        # Set the cross origin resource sharing header to allow AJAX
        self.response.headers.add_header("Access-Control-Allow-Origin", "*")
        
        # Print some JSON
        self.response.out.write("""
            <script src="https://apis.google.com/js/platform.js" async defer></script>
            <g:hangout render="createhangout" initial_apps="[
                { app_id : '69236067675', 'app_type': 'ROOM_APP' }
                ]"></g:hangout>
            """)

application = webapp.WSGIApplication([('/', MainHandler)], debug=True)
util.run_wsgi_app(application)
