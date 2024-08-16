import { isValidObjectId } from "mongoose";
import { create, findById, findByIdAndDelete, findByIdAndUpdate, find, countDocuments } from "../models/list.model";
export async function createList(req, res, next) {
  try {
    const list = await create(req.body);
    return res.status(200).json({ success: true, list });
  } catch (error) {
    next(error);
  }
}

//delete listing
export async function deleteList(req, res, next) {
  try {
    const userList = await findById(req.params.id);
    if (!userList) return next(errorHandler(404, "List not found"));
    if (userList.userRef.toString() !== req.user.id)
      return next(errorHandler(403, "You can delete only your list"));
    await findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "List deleted successfully" });
  } catch (error) {
    next(error);
  }
}

//get listing
export async function getList(req, res, next) {
  try {
    if(!isValidObjectId(req.params.id)) return next(errorHandler(400, "Invalid Id"));
    const list = await findById(req.params.id);
    if (!list) return next(errorHandler(404, "Listing not found"));
    return res.status(200).json({ success: true, list });
  } catch (error) {
    
  }
}
//update Listing
export async function updateList(req, res, next) {
  try {
    const userList = await findById(req.params.id);
    if (!userList) return next(errorHandler(404, "List not found"));
    if (userList.userRef.toString() !== req.user.id)
      return next(errorHandler(403, "You can update only your list"));
    const list = await findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          type: req.body.type,
          address: req.body.address,
          regularPrice: req.body.regularPrice,
          discountPrice: req.body.discountPrice,
          description: req.body.description,
          offer: req.body.offer,
          bathrooms: req.body.bathrooms,
          bedrooms: req.body.bedrooms,
          furnished: req.body.furnished,
          parking: req.body.parking,
          imageURLs: req.body.imageURLs,
        },
      },
      { new: true }
    );
    return res.status(200).json({ success: true, list });
  } catch (error) {
    next(error);
  }
}

//get searched list
export async function getLists(req,res,next){
  try{
   const limit = req.query.limit ? parseInt(req.query.limit) : 9;
   const startIndex = req.query.startIndex ? parseInt(req.query.startIndex) : 0;
   let offer = req.query.offer;
   if(offer === 'false' || offer === undefined){
    offer = {$in:[false,true]}
   }

   let furnished = req.query.furnished;
   if(furnished === 'false' || furnished === undefined){
    furnished = {$in:[false,true]}
   }

   let parking = req.query.parking;
   if(parking === 'false' || parking === undefined){
    parking = {$in:[false,true]}
   }

   let type = req.query.type;
   if(type === undefined || type === "all"){
    type = {$in:["rent","sale"]}
   }

   let searchTerm = req.query.searchTerm || "";
   let sort = req.query.sort || "createdAt";
   let order = req.query.order || "desc";

   const lists = await find({
    name: {$regex: searchTerm, $options: "i"},
    type,
    offer,
    furnished,
    parking
   }).sort({[sort] : order}).limit(limit).skip(startIndex);
   const count = await countDocuments({name: {$regex: searchTerm, $options: "i"}, type, offer, furnished, parking});
   return res.status(200).json({success:true,lists,count});
  }catch(error){
    next(error)
  }
}