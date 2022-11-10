console.log("hello");

document.querySelector('#btn-login').addEventListener('click', (e) => {
    login();
});
//document.body.style.backgroundColor = "grey";
//const API_URL="http://localhost:3031";
const API_URL = "https://wom22-ammar.azurewebsites.net";
const API_URL2 = "https://wom22-part2-ammar.azurewebsites.net/";
//const API_URL2 = "http://localhost:3000";
function showLoging() {
    document.querySelector('#login').style.display = 'block';
}

async function getUserInfo() {
    const resp = await fetch(API_URL + '/users/info', {
        method: "GET",
        headers: {

            "Authorization": "Bearer " + localStorage.getItem('jwt')
        }
    });

    if (resp.status > 201) { return showLoging(); }

    const notes = await resp.json();
    console.log(notes);

    let notesHTML = "";

    notesHTML += `
         <div><h2>Users info</h2></div>
         <div class = "note">
         Id: ${notes.userInfo._id} <br>
         Email: ${notes.userInfo.email} <br>
         FirstName : ${notes.userInfo.firstName}<br>
         LastName:  ${notes.userInfo.lastName}  <br>
        </div>
        
         `;

    document.querySelector('#usersInfo').innerHTML = notesHTML;
}

async function getCabins(name) {
    const resp = await fetch(API_URL + '/cabins/owned', {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('jwt')
        }
    });

    if (resp.status > 201) { return showLoging(); }

    const notes = await resp.json();
    console.log(notes);

    /**/
    let notesHTML = "";
    function testInputTrue(note){ 
        let sauna = "";
        let beach = "";
        if(note.sauna ==true){ sauna = "Sauna"}
        if(note.beach ==true){ beach = "Beach"}
        if (sauna != "" && beach != "" ){ return sauna +", "+ beach  ;}
         return sauna + beach  ;
}
    let nu = 0;
    
    notesHTML += `
        <form>     
            <select id="selectedCabins">`
                nu=0;
                for (const note of notes) {
                    nu += 1;
                    notesHTML += `
                    <option value="${note.address} ">
                    Cabin  ${nu} -
                    (${testInputTrue(note)}) <br>
                        ${note.address} 
                    </option>
                `;
            
                }  ` 
            </select>
            <button id="btn">Get the Selected Value</button>
        </form>
   `;
if(!name){ document.querySelector('#selectCabins').innerHTML = notesHTML;}
else{
    document.querySelector('#'+name).innerHTML = notesHTML;
}
   

}

async function getServices(name) {
    const resp = await fetch(API_URL2 + '/services', {
        method: "GET",
        headers: { "Authorization": "Bearer " + localStorage.getItem('jwt')}
    });

    if (resp.status > 201) { return showLoging(); }

    const notes = await resp.json();
    console.log(notes);

    /**/
    let notesHTML = "";
  

    
    notesHTML += `
    <form>     
        <select id="selectedServices">`
            nu=0;
            for (const note of notes) {
                nu += 1;
                notesHTML += `
                <option value=" ${note.service} ">
                ${note.service} 
                </option>
            `;
        
            }  ` 
        </select>
        <button id="btn">Get the Selected Value</button>
    </form>
`;
    
if(!name){document.querySelector('#selectServices').innerHTML = notesHTML;}
else{
    document.querySelector('#'+name).innerHTML = notesHTML;
}
    

}

function insertChooseCabin(){
    let chooseCabinDiv = `
    <div class="notes" id="chooseCabin">
    <h2>Choose cabin</h2>
    <div id="selectCabins">Not notes to show..</div>
    <h2>Select Services</h2>
    <div id="selectServices">Not notes to show..</div>
    <div id="selectDate">
        <h2> Select Date</h2>
            <input type="date" id="selectedDate" name="birthday">
            <a class="button button1" onclick="sendOrders()">Send</a>
    </div>
</div>
    `;

    document.querySelector('#insertChooseCabin').innerHTML = chooseCabinDiv;
}
function insertOrderedServices(){
    let chooseCabinDiv = `
    <div  id="ordersInfo">
    </div>
    <div id="selectServicesBtn">
    <a class="button button1" onclick="sendDeleteOS()">Delete</a>
    <a class="button button1" onclick="fixChangeOrders()">Change</a>
    </div>
    <div id="changeFolder">
    <div id="changeCabins"></div>
    <div id="changeServices"></div>
    <div id="changeDate"></div>
    <div id="selectServicesBtn2"></div>
    </div>
    `;

    document.querySelector('#insertOrderedServices').innerHTML = chooseCabinDiv;
}

async function login() {
    const resp = await fetch(API_URL + '/users/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: document.querySelector('#email').value,
            password: document.querySelector('#password').value

        })
    });
    const respJson = await resp.json();
    console.log(respJson);
    if (resp.status > 201) { return alert(respJson.msg); }

    localStorage.setItem("jwt", respJson.token);
    getUserInfo();

    insertChooseCabin();
    insertOrderedServices();
    getCabins();
    getServices();
    getOrders();
    LogoutButton();
}

async function getOrders() {
    const resp = await fetch(API_URL2 + '/orders', {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('jwt')
        }
    });

    if (resp.status > 201) { return showLoging(); }

    const notes = await resp.json();
    console.log(notes);

    /**/
    let notesHTML = "";
    notesHTML += `<h2>Ordered services</h2>`;
    notesHTML += `  
    <form id="getOrdersFormId"> 
    <select class="flex-container" id="OrderedSelectedValue" multiple> 
    `;
    for (const note of notes) {
        const changeDate = new Date(note.date);
        if (changeDate === 'Invalid Date')return;
        notesHTML += `
        <option class = "note flex-container" value="${note._id}">
                    
                        <div class="flex flex-item-left ">${note.cabin} ,</div>
                        <div class="flex flex-item-right "> ${note.service} ,</div>
                        <div class="flex flex-item-left "> ${changeDate.toISOString().split('T')[0]}</div>
                    
         </option> 
            `;
       
    }
    notesHTML += ` `;
    
    document.querySelector('#ordersInfo').innerHTML = notesHTML;

}

async function sendOrders() {
    const resp = await fetch(API_URL2 + '/orders', {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('jwt'),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        

            date: document.querySelector('#selectedDate').value,
            cabin: document.querySelector('#selectedCabins').value,
            service: document.querySelector('#selectedServices').value
        })
    });
    //const respJson = await resp.json();
    //resp.send(resp);
    getOrders();
    if (resp.status < 201) { return  alert("Yours orders  been sent"); }
    console.log(resp);
    // if (resp.status > 201) { return showLoging(); }

    // const notes = await resp.json();
    // console.log(notes);

}

async function fixChangeOrders() {
    
    let SelectedIdValue = getSelectedOptionValue('OrderedSelectedValue');
    if(!SelectedIdValue)return;
    localStorage.setItem("SelectedIdValue", SelectedIdValue);
    let notesHTML = "";
    let chooseCabinHTML= 
    `
    <h2>Choose cabin</h2>
    <div id="selectCabins">Not notes to show..</div>
    <h2>Select Services</h2>
    <div id="selectServices">Not notes to show..</div>
    <div id="selectDate">
    <h2> Select Date</h2>
    <input type="date" id="selectedDate" name="birthday">
    <a class="button button1" onclick="sendOrders()">Send</a>
    </div>`;

    
    document.querySelector('#OrderedSelectedValue').innerHTML = notesHTML;
    document.querySelector('#getOrdersFormId').innerHTML = notesHTML;
    document.querySelector('#selectServicesBtn').innerHTML = notesHTML;
    document.querySelector('#chooseCabin').innerHTML ='<h2>Choose cabin</h2>';
    // document.querySelector('#chooseCabin').style.display = 'none';
    getCabins('changeCabins');
    getServices('changeServices');
    document.querySelector('#changeDate').innerHTML = `<input type="date" id="selectedDate" name="birthday">`;
    document.querySelector('#selectServicesBtn2').innerHTML = ` <a class="button button1" onclick="saveOrderServices()">Change</a>`;

   

}

function getSelectedOptionValue(name){
   let selectNameId ="";
    if(name){
        selectNameId = document.querySelector('#'+name);
        if(selectNameId.value){return selectNameId.value;}
        if(selectNameId.options){return selectNameId.options[selectNameId.selectedIndex];}
    }
    else{return false;}
    
    // let e = document.querySelector('#OrderedSelectedValue');
    //     var value = e.value;
    //     var text = e.options[e.selectedIndex].text;

        return {selectNameId};     
}
// function testAndSaveInput(name){
//     let name = getSelectedOptionValue('name');
//     if(!name)return;
//     localStorage.setItem("name", name);
// }
async function sendChangeOrderServices(){
    const resp = await fetch(API_URL2 + '/orders/'+localStorage.getItem('SelectedIdValue'), {
        method: "PATCH",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('jwt'),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            date: localStorage.getItem('selectedDate'),
            cabin: localStorage.getItem('selectedCabins'),
            service: localStorage.getItem('selectedServices')
        })
    });
    //window.location.reload();

    insertChooseCabin();
    insertOrderedServices();
    getCabins();
    getServices();
    getOrders();

    if (resp.status < 201) { return  alert("Yours orders  been chenged"); }
    if (resp.status > 201) { return  alert("Date is not selected!"); }
    console.log(resp);
  
}
function saveOrderServices(){
 
    let selectedCabins = getSelectedOptionValue('selectedCabins');
     if(!selectedCabins)return;
     
     let selectedServices = getSelectedOptionValue('selectedServices');
     if(!selectedServices)return;
 
     let selectedDate = getSelectedOptionValue('selectedDate');
     if(!selectedDate)return;
 
     localStorage.setItem("selectedCabins", selectedCabins);
     localStorage.setItem("selectedServices", selectedServices);
     localStorage.setItem("selectedDate", selectedDate);

     sendChangeOrderServices();
 }

async function sendDeleteOS() {
    const selectNameId = document.querySelector('#OrderedSelectedValue').value;
    const resp = await fetch(API_URL2 + '/orders/'+selectNameId, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('jwt'),
            "Content-Type": "application/json"
        }
    });
    //const respJson = await resp.json();
    //resp.send(resp);
   
    getOrders();

    if (resp.status < 201) { return  alert("the orders services been deleted"); }
    console.log(resp);
    // if (resp.status > 201) { return showLoging(); }

    // const notes = await resp.json();
    // console.log(notes);

}

function myCabins() {
    console.log("cabins");
    getCabins();
}

function myUsers() {
    console.log("users");
    getUserInfo();
}

function myBookins() {
    console.log("bookings");
    getOrders();
}

function logOutUsers(){
    localStorage.removeItem("jwt");
    window.location.reload();
}

function LogoutButton(){
    if ('jwt' in localStorage){
        document.querySelector('#logOutButton').style.display = 'block';
    }
   
}
LogoutButton();


