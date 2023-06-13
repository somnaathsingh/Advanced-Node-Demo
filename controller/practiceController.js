const User=require("../models/User");
const jwt=require("jsonwebtoken");
const Product=require("../models/Product");
function saveAll(productName,price,res) {
    const newProduct=new Product({
        productName,
        price

    });
    newProduct.save()
    .then(()=> {
        return res.status(200).json({msg: 'Product registered'})
    }).catch((err)=> {
        return res.status(400).json({error:err});
    });
};
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
  
    // incorrect email
    if (err.message === 'incorrect email') {
      errors.email = 'That email is not registered';
    }
  
    // incorrect password
    if (err.message === 'incorrect password') {
      errors.password = 'That password is incorrect';
    }
  
    // duplicate email error
    if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
  
    // validation errors
    if (err.message.includes('user validation failed')) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  }
  const maxAge = 60*60*60;
  const createToken = (id) => {
    return jwt.sign({ id }, `${process.env.secret_key }`, {
      expiresIn: maxAge
    });

  };


  module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.create({ email, password });
      const token = createToken(user._id);

      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      console.log(token);
      res.status(201).json({ user: user._id ,token:token});
    }
    catch(err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
    console.log(token);
   
  }
  module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

  
    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });
    } 
    catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  
  }
  module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ msg:"Logout succesfully" });
  }
  module.exports.addProduct_post= (req,res,next)=>{
    const {productName,price }=req.body;
    return saveAll(productName,price,res);

}
module.exports.viewProduct_get=(req,res)=> {
    const {productName}=req.body;
    var prods=[];
    Product.find({productName:productName})
    .then(products=>{
      return res.status(200).json({products:products});
    })
    .catch(err=>{
      return res.status(400).json({error:err});
    }
      )

}