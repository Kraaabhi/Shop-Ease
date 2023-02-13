const mongoose=require("mongoose")
const productSchema= new mongoose.Schema({
    name:{
        type: String,
        required:[true,"please enter Product Name"],
        trim:true
    },
    description:{
        type: String,
        required:[true,"please enter Product Description"]
    },
    price:{
        type:Number,
        required:[true,"please enter Product Price"],
        maxLength:[8,"price length can not exceed 8 character"]
   },
    ratings:{
        type:Number,
        default:0

    },
    images:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
    category:{
        type:String,
        required:[true,"please enter Product Price"]
    },
    stock:{
        type:Number,
        required:[true,"please enter Product stock"],
        maxLength:[8,"Stock can not exceed 8 character"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true,
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }


        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model("Product",productSchema);