function ajax(formdata){ 
   // var a = document.forms["myForm"]["A"].value; 
   // var b = document.forms["myForm"]["B"].value; 
   //var formdata = "A="+a+"&B="+b; 
    
    xmlhttp = new XMLHttpRequest(); 
    xmlhttp.onreadystatechange=function(){ 
    if(xmlhttp.readyState==4 && xmlhttp.status==200){ 
        document.getElementById("result").innerHTML=xmlhttp.responseText; 
    }; 
    }; 
    xmlhttp.open("POST","http://localhost:8000",true); 
    xmlhttp.send(formdata); 
    return false; 
}

function buttonClick() {
    let interval = document.getElementById("interval").value;
    let numTrans = document.getElementById("numTrans").value;
    let response = ajax("p1&interval=" + interval + "&numTrans=" + numTrans);
}

function msgButtonClick() {
    let msg = document.getElementById("msg").value;
    let response = ajax("msg&" + msg);
}