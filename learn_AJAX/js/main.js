/**
 * Đây là hàm load_students, 
 * để load dataset vào table để hiển thị
 * @param {*} dataset - dữ liệu dataset
 * @param {*} tbstudents - id của table hiển thị
 */
function load_students(dataset,tbstudents)
{
    tbstudents=document.getElementById(tbstudents);
    var xhr =new XMLHttpRequest();
    xhr.open("GET",dataset,true);
    xhr.send()
    xhr.onreadystatechange=function()
    {
        if (this.readyState==4 && this.status==200)
        {
            var xmlDoc = xhr.responseXML;
            var students=xmlDoc.getElementsByTagName("student");
            for (var i=0; i<students.length;i++)
            {
                var student=students[i]
                var id=student.getElementsByTagName("id")[0].childNodes[0].nodeValue;
                var name=student.getElementsByTagName("name")[0].childNodes[0].nodeValue;
                var age=student.getElementsByTagName("age")[0].childNodes[0].nodeValue;
                var major=student.getElementsByTagName("major")[0].childNodes[0].nodeValue;
                var tr=document.createElement("tr");
                var tdid=document.createElement("td");
                tdid.innerHTML=id;

                var tdname=document.createElement("td");
                tdname.innerHTML=name;

                var tdage=document.createElement("td");
                tdage.innerHTML=age;

                var tdmajor=document.createElement("td");
                tdmajor.innerHTML=major;

                tr.appendChild(tdid);
                tr.appendChild(tdname);
                tr.appendChild(tdage);
                tr.appendChild(tdmajor);
                tbstudents.appendChild(tr);


            }
        }
    }
}