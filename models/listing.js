const mongoose=require("mongoose");
// store mongoose.schema in variable then use this variable
const Schema=mongoose.Schema;
const Review=require("./review.js")

const listingSchema = new Schema({
    title: {
        type: String,
        required:true
    },

    description: String,
    
    image: {
        url:String,
        filename:String,
        // type: String,
        // default:
        //      "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // set: (v) => 
        // v ===""
        // ? "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        // : v,
    },
    category: String,
        // enum:["Trending","Rooms","Iconic Cities","Mountains","Castles","Amazing Pools","Camping","Farms","Arctic","Domes","Boats"],

    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId, //to store obj id for every listing to review on that listing
            ref:"Review", //our review model is made reference here
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }

});
// add mongo middleware 
// used if any listing delete its reviews also delete
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews }});
    }
   
})


const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;