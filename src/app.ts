import createError, { HttpError } from 'http-errors'
import express, { Request, Response, NextFunction} from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import logger from'morgan';
import dotenv from 'dotenv'
import graphqlHTTP from 'express-graphql';
// import schema from'./model/schema'
const schema = require('./model/schema')
import { Auth } from './controller/auth'

dotenv.config()

var app = express();

// imported route
import registerRoute from './routes/register'

app.use(logger('dev'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//login, 

// app.use('/register', registerRoute)

// route
app.use('/graphql', graphqlHTTP((req, res,next)=>({
  schema,
  graphiql: true,
  context: {req, res,next}
})))



// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
