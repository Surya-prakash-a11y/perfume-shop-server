const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const app = express()

//Important add this code
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['PUT', 'GET', 'POST', 'DELETE']
}));

app.use(express.json())


const FoodModel=require("./Models/Food")

mongoose.connect("mongodb://localhost:27017/food")
.then(() => console.log(`Connected to MongoDB...`))
.catch(err => console.error(`Could not connect to MongoDB...`)) 


//Inserted the data
app.post("/insert",async(req,res)=>{
    const {foodName,description}=req.body;
    const food=new FoodModel({foodName,description})
    try
    {
      await food.save()
      res.send("Data inserted successfully")
    }
    catch(err)
    {
         console.log(err)

    }
})

//Retrieving the data

app.get("/read",async(req,res)=>{
  try{
    const food=await FoodModel.find()
    res.send(food)
  }
  catch(err)
  {
    console.log(err)
  }
})

//Updating the data

app.put("/update",async(req,res)=>{
  const {newFoodName,id}=req.body;
  try{
       const updateFood=await FoodModel.findById(id);
       if(!updateFood)
       {
        return res.status(404).send("Data not found")
       }
       updateFood.foodName=newFoodName;
       await updateFood.save()
       res.send("Data updated successfully")
    }
    catch(err)
    {
      console.log(err)
    }
})

//Deleting the data

app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params; // Destructuring id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID format");
  }
  
  try {
    const result = await FoodModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send("Food item not found");
    }
    res.send("Food item deleted successfully");
  } catch (err) {
    console.error("Error deleting food item:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3001,()=>{
    console.log("Server is running on port 3001")
})