how to call your Task Manager API step-by-step

1.  Creates a new user with hashed password.: 
POST /register
Payload Example:

{
  "email": "amandeep@example.com",
  "password": "yourSecurePassword"
}



2. User Login and Returns a JWT token on success.: 
      POST /login
   
Payload Example:

   {
     "email": "amandeep@example.com",
     "password": "yourSecurePassword"
  }


4 Authenticated Routes : 

 Authorization: Bearer <token>



5 . Create Task
Endpoint: POST /tasks
Headers: Authorization: Bearer <token>

Payload Example:
      {
           "title": "Finish Assignment",
            "description": "Node.js CRUD with Auth",
            "status": "pending",
           "dueDate": "2025-04-13T18:00:00"
      }


6. Get All Tasks

        Endpoint: POST /getTasks
         Headers: Authorization: Bearer <token>
         No payload needed.
  



7  Update a Task
Endpoint: POST /updateTask
Headers: Authorization: Bearer <token>

Payload Example
     {
        "id": 1,
       "title": "Update Title",
        "description": "Updated task info",
       "status": "in-progress",
        "dueDate": "2025-04-14T12:00:00"
      }



 8. Delete a Task
Endpoint: DELETE /deleteTask/
Headers: Authorization: Bearer <token>

Payload Example
       {  
          "id" : 2

        }




  10. Task Reminder (CRON)
         Runs every second for testing. Logs reminders in console for tasks due within the next 1 min.You can extend this with email notifications later.
 
