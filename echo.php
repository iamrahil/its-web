<?php

	$connection = mysql_connect('localhost','root','password') or die("Could not connect");
	$db = mysql_select_db('map',$connection) or die("Database not found");
	$query = "SELECT * from point where 1";
	$result = mysql_query($query,$connection);

	echo "[";
	$row = mysql_fetch_array($result);
	echo "{\"id\":".$row["id"].","."\"latitude\":".$row["latitude"].","."\"longitude\":".$row["longitude"].",\"name\":\"".$row["name"]."\",\"type\":\"".$row["type"]."\"}";
	while($row = mysql_fetch_array($result)){
		//echo $row['id']."<br/>";
		//echo json_encode($row);
		echo ",{\"id\":".$row["id"].","."\"latitude\":".$row["latitude"].","."\"longitude\":".$row["longitude"].",\"name\":\"".$row["name"]."\",\"type\":\"".$row["type"]."\"}";
		//echo ",";
	}
	echo "]";
?>
