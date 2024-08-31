const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    let allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};


module.exports.renderNewForm=(req,res)=>{
    // res.send("route is running");
    console.log(req.user);
    //authentication if user exist in database then it allow to create listing
    // middleware is loggedIN
    res.render("listings/new.ejs");
        };


module.exports.showListing=async (req,res)=>{
            let {id}=req.params;
            console.log(id);
           const listing=await Listing.findById(id)
           .populate({
                path:"reviews",
                populate:{
                    path:"author",
                },
            })
           .populate("owner");
        //    add flash id listing not found 
           if(!listing){
            req.flash("error","Listing does not exists!");
            res.redirect("/listings");
           }
    
           res.render("listings/show.ejs",{listing});
        
        }


module.exports.createListing= async (req,res,next)=>{


    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
        // console.log(response);
        // res.send("!done");
        
        //short method to get all value in key:value key is listing and values is title,desc etc
        //     const data=req.body.listing[title];
        //    console.log(data);
        
        let url =req.file.path;
        let filename =req.file.filename;
        // console.log(url,"..",filename);
        // very short method to crete new obj of listting class pass this vlaue
            const newListing= new Listing(req.body.listing);
                    

            newListing.owner=req.user._id;
            newListing.image={url,filename};
            // newListing.category=req.body.listing;
            newListing.geometry=response.body.features[0].geometry;
        const{title}=req.body;
        console.log(title);

            
          
            let savelisting=await newListing.save(); 
            // console.log(savelisting);
            //flash for create new listings now i use this include folder
            req.flash("success","New Listing Created!");
            res.redirect("/listings");
        
        }

module.exports.renderEditForm=async(req,res)=>{
            let {id}=req.params;
                // console.log(id);................
               const listing=await Listing.findById(id); 
               if(!listing){
                req.flash("error","Listing does not exists for Update!");
                res.redirect("/listings");
               }
               let originalImageUrl=listing.image.url;
               originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
               res.render("listings/edit.ejs",{listing,originalImageUrl});
            };

module.exports.updateListing=async (req,res)=>{
                // if(!req.body.listing){
                //     throw new ExpressError(400,"Send valid data for listing");
                //     }
                let {id}=req.params;
                let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
                if(typeof req.file !== "undefined"){
                    let url =req.file.path;
                    let filename =req.file.filename;
                    listing.image={url,filename};
                    await listing.save(); 
                }
                
                req.flash("success","Listing Updated!")
                res.redirect(`/listings/${id}`);
            }


module.exports.destroyListing=async (req,res)=>{
                let {id}=req.params;
               let deletedListing= await Listing.findByIdAndDelete(id);
               console.log(deletedListing + "This listing is deleted"); 
               req.flash("success","Listing Deleted!");
               res.redirect("/listings");
            
            }