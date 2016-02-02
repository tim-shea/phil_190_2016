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
    yang.angleText = "Angle:" + yang.angle + "\n";
    //watchout logical shortcut
    if (!(cursors.up.isDown || cursors.down.isDown || 
        cursors.left.isDown || cursors.right.isDown)
        && yang.directionalbonus()) { 
        chance = Math.random();
        if (chance <= .10) {
            yang.angle += 15;
        } else if (chance > .90) {
            yang.angle -= 15;
        }
    } else {
        yang.leap = 0;
    }
};

yang.directionalbonus = function() {  //invoke only inf override = false  
    if ( yang.leap === 10) {
        yang.speed = -2;
        yang.leap = 0;
        yang.motionText = "Where are berries?..";
    } else if (yang.speed < 0)
    {
        yang.speed = 10;
        yang.motionText = "No berries..";
    } else {
        if ( yang.leap === 0 && (yang.angle % 45) <= 10) {
            yang.speed = 600;
            yang.motionText = "Berries alludes me!";
        } else {
            yang.leap += 1;
            yang.speed -= 61;
        }
    }
    //console.log('Things happens.');
    return yang.speed > 0;
}



/* 
botplayground.html
<script src="bots/yang/yang.js"></script>
<option value="yang">Yang</option>

botplayground.js
var bots = [jeff, mouse, yang];
*/