
class TownLevel extends TownLevel
{
    constructor(_path)
    {
        super(_path);
    }

    //Moves the player to the Farm if they are in a certain position
    moveToFarm(x, y)
    {
        if (x == 0, y == 0)
        {
            window.location.replace("./levels/farm_spring.json");
        }
    }
}
