// isLeapYear(year: Number): Boolean
// Given a year, returns true
// if the given year is a leap year
// and false if it is not. 
function isLeapYear(year)
{
  // Calculate if the year is a leap y ear or not :)
  return ((year % 4 === 0 && year % 100 > 0) || year %400 == 0);
}

// getDayOfYear(year: Number): Number
// Given a year, returns the number of 
// days in that year. 
function getDaysInYear(year) 
{
  // Return the number of days in the year
  return isLeapYear(year) ? 366 : 365;
}

// Given a day and a year, returns the date of the 
// given day within the given year.
function getDateOfDay(day, year)
{
  // Return a date with the given day and year
  return new Date(year, 0, day);
}

// getDayOfYear(date: Date): Number
// Given a date object, returns what
// day of the given year the date is.
function getDayOfYear(date)
{
  // Get the date of the first day of the year
  var start = new Date(date.getFullYear(), 0, 0);

  // Get the difference between the current date and the starting date
  var diff = date - start;

  // Get the time for one day
  var oneDay = 1000 * 60 * 60 * 24;

  // Convert the diff into total days
  var days = Math.floor(diff / oneDay);

  // Return the number of days
  return days;
}

// getDateString(date: Date): String
// Gets a pretty-printed string for the given date
function getDateString(date)
{
  // Get the text for the date in en-us format
  return date.toLocaleDateString("en-us", { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', day: 
    'numeric' }
  );
}

// getFrameAt(dayOfYear: Number): String
// Given a date, returns the frame which
// (should) be available on the date.
function getFrameAt(year, dayOfYear)
{
  // Determine the frames set we should be referencing
  let frames = isLeapYear(year) ? FRAMES_LEAP : FRAMES;

  // Return the frame which lines up with the given day
  return frames[(dayOfYear-1) % frames.length];
}

// getFrameFromFrame(date: )
function getFramesFromDate(date = null)
{
  // Get the date lookup element from the form
  let date_lookup = document.getElementById('date-lookup');

  // If a date is provided
  if (date !== null)
  {
    // Update the value of the date input
    date_lookup.valueAsDate = date;
  }
  else // Date is not provided
  {
    // Get the date from the input
    date = date_lookup.valueAsDate;
  }

  // Count value
  let count = null; 

  if (document.getElementById('get-daily').checked)
  {
    // One frame only
    count = 1;
  }
  else if (document.getElementById('get-weekly').checked)
  {
    // Seven frames
    count = 7;
  }
  else if (document.getElementById('get-monthly').checked)
  {
    // Thirty frames
    count = 30;
  }
  else // Shouldn't happen
  {
    throw "unhandledRadioInputException";
  }

  // Clear the current bingo frame list
  clearBingoFrameList();

  // Loop over the count variable
  for(let i = 0; i < count; i++)
  {
    // Get the current date
    let currentDate = new Date(date);

    // Increment the count offset onto the current date
    currentDate.setDate(date.getDate() + i);

    // Show the bingo frame for the given date
    showBingoFrame(
      getFrameAt(
        currentDate.getFullYear(), 
        getDayOfYear(currentDate)
      ), 
      [currentDate]
    );
  }
}

// getDateFromFrame(name: String): Void
// Shows the date(s) for the given frame
// on the screen
function getDatesFromFrame(frame = null)
{
  // Get the date lookup element from the form
  let frame_lookup = document.getElementById('frame-lookup');

  // List of frames found
  frames_matched = {
    // Will contain lists of dates for each matching frame
  };

  // If a frame is provided
  if (frame !== null)
  {
    // Update the value of the frame input
    frame_lookup.value = frame;
  }
  else // Frame is not provided
  {
    // Get the frame from the input
    frame = frame_lookup.value;
  }

  // Get the current year
  let year = new Date().getFullYear();

  // Determine if we should use the leap year frame set or not
  let frames = isLeapYear(year) ? FRAMES_LEAP : FRAMES;

  // Loop over all of the frames in the year
  for(let i = 0; i < frames.length; i++)
  {
    // If the current frame matches the search string
    if (frames[i].includes(frame.toLowerCase()))
    {
      // Get the name of the current frame
      let frame_matched = frames[i];

      // If the frame is already in the matched frames list
      if (Object.keys(frames_matched).includes(frame_matched))
      {
        // Add the date to the list of dates for the frame
        frames_matched[frame_matched].push(getDateOfDay(i + 1, year));
      }
      else // Need to create new element
      {
        // Add the date to the list of dates for the frame
        frames_matched[frame_matched] = [getDateOfDay(i + 1, year)];
      }
    }
  }

  // Get the list of frames found
  let frame_keys = Object.keys(frames_matched).sort();

  // If there is at LEAST one frame returned from the query
  if (frame_keys.length > 0)
  {
    // Clear the current table
    clearBingoFrameList();

    // Loop over all of the frames, sorted alphabetically
    for (let frame_name of frame_keys)
    {
      // Get all of the dates for the given frame
      let frame_dates = frames_matched[frame_name];

      // Call showBingoFrame for the date list and frame
      showBingoFrame(frame_name, frame_dates);
    }
  }
}

// showBingoFrame(date: Date, frame: String)
// Given a date and a frame name, adds a new 
// div to the page showing the name of the frame
// and the date it is available.
function showBingoFrame(name, dates)
{
  // Div for containing all of the bingo elements
  let bingo_div = document.getElementById('bingo-frames');

  { // Subsection for frame div

    // Create new bingo frame div
    let frame_row = document.createElement('tr');

    { // Subsection for frame name

      // Create the div for the frame name
      let frame_name = document.createElement('th');

      // Set the text to the frame name
      frame_name.innerHTML = name;

      // Add the text to the frame
      frame_row.appendChild(frame_name);
    }

    { // Subsection for frame image

      // Create the col for the frame image
      let col_img = document.createElement('td');

      // Create the image for the frame div
      let frame_img = document.createElement('img');

      // Set the path to the image source file
      frame_img.src = "img/frames/" + name + ".png";

      // Add the frame image to the column
      col_img.appendChild(frame_img);

      // Add the column to the row
      frame_row.appendChild(col_img);
    }


    { // Subsection for frame dates

      // Create the col for the dates
      let col_dates = document.createElement('td');

      // Loop over all of the dates
      for(let date of dates)
      {
        // Create the div for the date div
        let date_div = document.createElement('div');

        // Set the text to the date text
        date_div.innerHTML = getDateString(date);

        // Add the text to the frame
        col_dates.appendChild(date_div);
      }

      // Add the dates column to the row
      frame_row.appendChild(col_dates);
    }
    
    // Add the new div to the main bingo div
    bingo_div.appendChild(frame_row);
  }
}

// clearBingoFrameList(void): Void
// Clears the currently displayed bingo frame list.
function clearBingoFrameList()
{
  // Div for containing all of the bingo elements
  let bingo_div = document.getElementById('bingo-frames');

  // Empty the innerHTML property
  bingo_div.innerHTML = "";
}

// Automatically check the single day box
document.getElementById('get-daily').checked = true;

// Startup code
getFramesFromDate(new Date());