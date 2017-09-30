<!DOCTYPE HTML>
<html>
	<head>
		<title></title>
		<script src="static/.js"></script>
		<link rel="stylesheet" href="css/mentorMain.css">
		<link rel="icon" href="static/icon.png"/>
        
	</head>
	<body>
        <?php
            $conn = new PDO("mysql:host=localhost;dbname=cfg", "root", "");

            // Check connection
            if (!$conn) {
                die("Connection failed: " . mysqli_connect_error());
            }
            $cmd = "SELECT mentor_firstname FROM mentor WHERE id=3";
            $statement = $conn->prepare($cmd);
            $statement->execute();
            $mentor = $statement->fetch();
            
            $cmd = "SELECT * FROM teams where Team_ID =3";
            $statement = $conn->prepare($cmd);
            $statement->execute();
            $team = $statement->fetch();
            
            $cmd = "SELECT first_Name FROM student WHERE team_id=3";
            $statement = $conn->prepare($cmd);
            $statement->execute();
            $student = $statement->fetchAll();
            $name1 = $student[0][0];
            $name2 = $student[1][0];
            $name3 = $student[2][0];
            $name4 = $student[3][0];
            
        ?>    
        <!-- Insert mentors -->	
        <h1><?php echo $mentor[0] ?></h1>
        <!-- Insert team name -->
        <h1>Team <?php echo $team[0] ?></h1>
        <br>
        <figure class = "ww">
            <a href = "input.html"><?php echo "<img src = 'static/$name1.png'>"?></a>
            <figcaption>
                <input type="checkbox" value="None" id="squaredTwo" name="check" onchange="takeAttendance(this,'name0',<?php echo $name1?>)"/>
                <span id = "userOne"><?php echo $name1?></span>
            </figcaption>    
        </figure>
        <figure>
            <a href = "input.html"><?php echo "<img src = 'static/$name2.png'>"?></a>
            <figcaption>
                <input type="checkbox" value="None" id="squaredTwo" name="check" onchange="takeAttendance(this,'name1',<?php echo $name2?>)"/>
                <span id = "userTwo"><?php echo $name2?></span>
            </figcaption>    
        </figure>
        <br/>
        <figure class = "ww">
            <a href = "input.html"><?php echo "<img src = 'static/$name3.png'>"?></a>
            <figcaption>
                <input type="checkbox" value="None" id="squaredTwo" name="check" onchange="takeAttendance(this,'name2',<?php echo $name3?>)"/>
                <span id = "userThree"><?php echo $name3?></span>
            </figcaption>    
        </figure>
        <figure>
            <a href = "input.html"><?php echo "<img src = 'static/$name4.png'>"?></a>
            <figcaption>
                <input type="checkbox" value="None" id="squaredTwo" name="check" onchange="takeAttendance(this,'name3',<?php echo $name4?>)"/>
                <span id = "userFour"><?php echo $name4?></span>
            </figcaption>    
        </figure>   
        
        <div class="slideshow">
            <img class="mySlides" <?php echo " src = 'static/$name1.png'"?> >
            <img class="mySlides" <?php echo " src = 'static/$name2.png'"?> >
            <img class="mySlides" <?php echo " src = 'static/$name3.png'"?> >
            <img class="mySlides" <?php echo " src = 'static/$name4.png'"?> >
        </div>

	</body>
	<script>
    function takeAttendance(who,qname,name) {
        if(who.checked){
            who.setAttribute("disabled", "disabled");
            document.getElementById(qname).innerHTML = "Attendance taken for " + name;
            //log user attendance 
        }        
    }
    var myIndex = 0;
    carousel();

    function carousel() {
        var i;
        var x = document.getElementsByClassName("mySlides");
        for (i = 0; i < x.length; i++) {
           x[i].style.display = "none";  
        }
        myIndex++;
        if (myIndex > x.length) {myIndex = 1}    
        x[myIndex-1].style.display = "block";  
        setTimeout(carousel, 3000); // Change image every 2 seconds
    }
	</script>
</html>