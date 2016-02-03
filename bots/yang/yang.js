var yang = new Bot(240, 220,'yang','bots/yang/yang.png');
yang.angle = 45;
yang.speed = 45;

yang.angleText;
yang.motionText = "Its a Good day for philoberry.";
yang.chance;
yang.leap = 0;

yang.getStatus = function() {
    return yang.angleText + "\n" + yang.motionText + "\n";
};

yang.update = function() {
    yang.angle = yang.angle % 360;
    yang.angleText = "Angle:" + yang.angle + "\n";
    //watchout logical shortcut
    if (!(cursors.up.isDown || cursors.down.isDown || 
        cursors.left.isDown || cursors.right.isDown)) { 
        if (yang.speed < 0) {
            yang.speed += 5;
        } else if (yang.leap === 0 && yang.speed < 100) {
            wanderMotion();
        } else if (yang.leap === 0 && yang.speed < 200) {
            gallopMotion();
        } else if (yang.angle % 45 < 3 || yang.angle % 45 > 42){             
                leapMotion();
        } else {
            yang.speed -= 125;
        }
    }
};

function wanderMotion () {
    yang.motionText = "Its a Good day for philoberry.";
    yang.chance = Math.random();
    if (yang.chance <= .10) {
        yang.angle += 15;
        yang.speed += 1;
    } else if (yang.chance > .90) {
        yang.angle -= 15;
        yang.speed += 1;
    }
    //console.log("Wander :" + yang.leap + "/tSpeed : " + yang.speed);
}

function gallopMotion () {
    yang.motionText = "Where are berries?..";
    yang.chance = Math.random();
    if (yang.chance <= .10) {
        yang.speed += 5;
    } else if (yang.chance > .90) {
        yang.speed -= 1;
    }
    //console.log("Gallop :" + yang.leap + "/tSpeed : " + yang.speed);
}

function leapMotion () {  //invoke only inf override = false  
    if (yang.leap === 0) {
        yang.chance = Math.random(); //this decide leap
        yang.leap = 50; // turn on leap
        yang.speed = 50;
        yang.motionText = "Berries alludes me!";
    } else if (yang.leap > 41) {
        yang.speed += 75;
        yang.leap -= 2;
    } else if (yang.leap > 9) {
        yang.leap -= 1;
    } else if (yang.leap > 0) {
        yang.speed -= 75;
        yang.leap -= 2;
    } else if (yang.chance > 0.5) {
        yang.leap = 50;
        yang.chance -= 0.5;
    } else if (yang.chance > 0.25) {
        yang.leap = 50;
        yang.chance -= 0.25;
    } else if (yang.chance > 0.1) {
        yang.leap = 50;
        yang.chance -= 0.1;
    } else {
        yang.leap = 0; //end leap motion
    }
    //console.log("Leap :" + yang.leap + "/tRandom: " + yang.chance + "/tSpeed : " + yang.speed);
}

/* 
botplayground.html
<script src="bots/yang/yang.js"></script>
<option value="yang">Yang</option>

botplayground.js
var bots = [jeff, mouse, yang];
*/