// export const catchErrors = (fn) => (req, res, next) => {
//   try {
//     fn(req, res, next);
//   } catch (err) {
//     next(new Error(err.message));
//   }
// };
export const catchErrors = (fn) => {
  return (req, res, next) => {
    Promise.resolve()
      .then(() => {
        try {
          return fn(req, res, next);
        } catch (err) {
          next(new Error(err.message));
        }
      })
      .catch((err) => {
        next(new Error(err.message));
      });
  };
};
