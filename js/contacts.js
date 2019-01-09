let contactsList = [];
function getContacts(){

  fetch('http://localhost:3000/contacts').then(response =>{

      if(response.ok){         
              return response.json();          
      }
      else if(response.status == 404){
          return Promise.reject(new Error('Invalid URL'))
      }
      else if(response.status == 401){
          return Promise.reject(new Error('UnAuthorized User...'));
      }
      else{
          return Promise.reject(new Error('Some internal error occured...'));
      }
  }).then(contactsResponse =>{
      contactsList = contactsResponse;  
      displayContacts(contactsList);
  }).catch(error =>{
    const errorEle = document.getElementById('error');
    errorEle.innerHTML = `<h2 style='color:red'>${error.message}</h2>`      
  })
    
}

function displayContacts(contactsList){
    //Display the contacts in UI
  const tableEle =   document.getElementById('contactstable');
  const tableBodyEle = tableEle.getElementsByTagName('tbody')[0];
  let tableBodyHTMLString = '';
  
  contactsList.forEach(contact => {
    // tilt quotes is used to append / treat all the data within that to be a single string  
    tableBodyHTMLString +=
       `<tr>
            <td>${contact.name}</td>
            <td>${contact.contactno}</td>
            <td>${contact.email}</td>
            <td><button class='btn btn-primary' onclick='updateContact(${contact.id})'>update</button></td>
            <td><i class='fa fa-trash' style='color:red;font-size:1.2em;cursor:pointer' onclick='removeContact(${contact.id})'></i></td>
        </tr>      
      `
  });
  tableBodyEle.innerHTML = tableBodyHTMLString;
  
}

function updateContact(id){
    // to show modal dialog box / popup
    $("#myModal").modal();
    let contact = contactsList.find((contact)=>{ 
        if(contact.id === id){
            return contact;
        }
    });

    // prepopulate the value if exists
    if(contact){
        document.getElementById("updateid").value = contact.id;
        document.getElementById("updatename").value = contact.name;
        document.getElementById("updatecontactno").value = contact.contactno;
        document.getElementById("updateemail").value = contact.email;
    }
}

function updateContactData(event){
    // to prevent page reloaded by default for every event
    event.preventDefault();
    
    //Get the data from the form
    let id = document.getElementById('updateid').value; // form hidden field
    let name = document.getElementById('updatename').value;
    let contactno = document.getElementById('updatecontactno').value;
    let email = document.getElementById('updateemail').value;
    
    const contact = {
        id : id,
        name : name,
        contactno : contactno,
        email : email
    };
    
    //Fetch POST
    fetch(`http://localhost:3000/contacts/${id}`,{
        method: 'PUT',
        headers:{
            'content-type':'application/json'
        },
        body: JSON.stringify(contact)
    }).then(response =>{
        if(response.ok){
            return response.json();
        }
    }).then(updatedContact =>{
        let oldContact = contactsList.find((contact)=>{
            if(contact.id == id){
               return contact;
            }
        });
        oldContact.name = name;
        oldContact.contactno = contactno;
        oldContact.email = email;
        displayContacts(contactsList);
        // to close the modal popup once submitted
        $("#myModal").modal('toggle');
    })
}

function addContact(event){
    event.preventDefault();
    //Get the data from the form
    let name = document.getElementById('name').value;
    let contactno = document.getElementById('contactno').value;
    let email = document.getElementById('email').value;
    const contact = {
        name : name,
        contactno : contactno,
        email : email
    };
    //Fetch POST
    fetch('http://localhost:3000/contacts',{
        method: 'POST',
        headers:{
            'content-type':'application/json'
        },
        body: JSON.stringify(contact)
    }).then(response =>{
        if(response.ok){
            return response.json();
        }
    }).then(addedContact =>{
        contactsList.push(addedContact);
        displayContacts(contactsList);
    })
}

function removeContact(id){
    //send delete request to json-server
    fetch(`http://localhost:3000/contacts/${id}`,{
        method: 'DELETE'
        }).then(response =>{
            if(response.ok){
                return response.json();
            }
        }).then(deleteResponse =>{
            //Delete this entry from the array
            const index = contactsList.findIndex(contact => contact.id === id);
            contactsList.splice(index,1);
            displayContacts(contactsList);
        })
}