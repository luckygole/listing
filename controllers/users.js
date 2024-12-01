const User = require("../models/user");


//signup form render//
module.exports.signupformRoute = (req,res)=>{
    res.render("users/signup.ejs")
}    

//signup route
module.exports.signupRoute = async(req,res)=>{
    try{
     let { username , email , password } = req.body;
     const newUser = new User({email, username});
     const registeredUser = await User.register(newUser , password);
     console.log(registeredUser);
     req.login(registeredUser, (err)=>{
         if(err){
             return next(err);
         }
         req.flash("success", "Welcome to wanderlust!");
         res.redirect("/listings");
     })
    } catch(e) {
     req.flash("error",e.message);
     res.redirect("/signup");
    }
}    

//login form render//
module.exports.loginFormRoute = (req,res)=>{
    res.render("users/login.ejs")
}

//login route actaully login toh wahi ho gyi yh toh login ke baad user ko jana kaha h us cheej ke liye hai//
module.exports.loginRoute = async(req , res)=>{
    req.flash("success" , "welcome back in wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl)
}

//logout route//
module.exports.logoutRoute = (req,res,next)=>{  
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logout !");
        res.redirect("/listings")
    }) 
};    
