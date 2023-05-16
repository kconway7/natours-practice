const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// Validation for id parameter on route
exports.checkID = (req, res, next, val) => {
  if (val > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

// Validation for correct body information
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid data',
    });
  }
  next();
};

exports.getAllTours = (request, response) => {
  response.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (request, response) => {
  const tour = tours.find((el) => el.id === +request.params.id);
  response.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

exports.createTour = (request, response) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, request.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      response.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (request, response) => {
  response.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated Tour here',
    },
  });
};

exports.deleteTour = (request, response) => {
  response.status(200).json({
    status: 'success',
    data: null,
  });
};
