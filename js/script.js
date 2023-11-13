/*
Treehouse Techdegree:
FSJS Project 2 - Data Pagination and Filtering
*/
let itemsPerPage = 9;

//takes any number of document.elements (>1) and makes the siblings of a parent element in the order provided
function createSiblings(parent, siblings){
   //must be at least 2 siblings
   let last = siblings.length-1;
   parent.appendChild(siblings[last]);
   for(j=last-1; j>=0; j--){
      firstChild = parent.childNodes[0];
      firstChild.parentNode.insertBefore(siblings[j], firstChild); 
   }
}

//creates a document HTML element of type, with classes, and properties
function createElement(type, classes, props){
   let element = document.createElement(type);
   if(classes){
      for(const c in classes){
         element.classList.add(classes[c]);
      }
   }
   if(props){
      Object.keys(props).forEach(key => {
         element[key] = props[key];
      });
   }
   return element;
}

/*
For assistance:
   Check out the "Project Resources" section of the Instructions tab: https://teamtreehouse.com/projects/data-pagination-and-filtering#instructions
   Reach out in your Slack community: https://treehouse-fsjs-102.slack.com/app_redirect?channel=unit-2
*/

/*
Create the `showPage` function
This function will create and insert/append the elements needed to display a "page" of nine students
*/

function showPage(list, page){
   //init
   let end = page*itemsPerPage;
   let start = end-itemsPerPage;

   //if end index > length of array, make it length of array
   end = Math.min(end,list.length);

   //select ul element w class student-list and store
   let ul = document.querySelector(".student-list");
   //clear prev results
   ul.innerHTML = '';
   
   //string logic
   function generateStudentName(name){
      let s = '';
      if(name.title){
         s = name.title + ' ';
      }
      if(name.first){
         s += name.first + ' ';
      }
      if(name.last){
         s += name.last;
      }
      s = s.trim();
      return s;
   }

   //students to be rendered on the given page
   let students = [];

   //create HTML elements for each student
   for(let i=start; i<end; i++){

      //init student li container
      let studentLi = createElement('li', ['student-item','cf'], false);

      //init first div
      let firstDivNode = createElement('div', ['student-details'], false);

      //create img
      let imgNode = createElement('img', ['avatar'], {
         src: list[i].picture.thumbnail, 
         alt: generateStudentName(list[i].name) + "'s profile picture"
      });
      
      //create h3
      let h3Node = createElement('h3', false, {
         innerHTML: generateStudentName(list[i].name)
      });

      //create span
      let spanNode = createElement('span', ['email'], {
         innerHTML: list[i].email
      });

      //relate siblings
      createSiblings(firstDivNode, [imgNode, h3Node, spanNode]);

      //init second div
      let secondDivNode = createElement('div', ['joined-details'], false);

      //init span
      spanNode = createElement('span', ['date'], {
         innerHTML: list[i].registered.date
      });

      //relate
      secondDivNode.appendChild(spanNode);

      createSiblings(studentLi, [firstDivNode, secondDivNode]);
      students.push(studentLi);
   }

   //relate siblings and parent element objects if there are any students
   if(students.length > 0){
      createSiblings(ul, students);
   }else{
   //if there are no students to display, display no results found
      ul.innerHTML = 'No results found';
   }
}


/*
Create the `addPagination` function
This function will create and insert/append the elements needed for the pagination buttons
*/

function addPagination(list){

   //init
   let numPages = Math.ceil(list.length / itemsPerPage);
   let linkList = document.querySelector(".link-list");
   linkList.innerHTML = '';
   

   //current page
   let page = 1;

   //init page button elements
   let buttons = [];
   for(let i=0; i<numPages; i++){
      let li = createElement('li', false, false);
      let button = createElement('button', false, {
         type: 'button',
         innerHTML: i+1
      });

      //setup element relations
      li.appendChild(button);
      //append array of page buttons
      buttons.push(li);
   }
   //init active page to first page button
   if(list.length > 0){
      buttons[0].firstChild.classList.add('active');
   }

   //relate HTML elements
   if(buttons.length > 1){
      createSiblings(linkList, buttons);
   }
   //refresh page
   showPage(list, page);

   //add event listener to update current page if user presses a page button
   linkList.addEventListener("click", (e) => {
      if(e.target.type === 'button'){
         linkList.childNodes[page-1].firstChild.classList.remove('active');
         e.target.classList.add('active');
         page = e.target.innerHTML;
         showPage(list, page);
      }
   });

}

function addSearch(data){
   let prevSearchResults, newSearchResults = [];

   //init HTML
   let searchContainer = document.querySelector("h2");

   //init block
   let label = createElement('label', ['student-search'], {
      for: 'search'
   });

   let span = createElement('span', false, {
      innerHTML: 'Search by name'
   });

   let input = createElement('input', false, {
      id: 'search',
      placeholder: 'Search by name ...'
   });
   
   let button = createElement('button', false, {
      type: 'button'
   });

   let img = createElement('img', false, {
      src: "img/icn-search.svg",
      alt: "search icon"
   });

   //assign relations
   button.appendChild(img);
   createSiblings(label, [span, input, button]);
   searchContainer.appendChild(label);

   //if the user enters a-z, A-Z, backspace, or enter
   function isValidKey(keyCode){
      //a-z, upper or lower
      if(keyCode >= 65 && keyCode <= 92){
         return true;
      //backspace or return/enter
      }else if(keyCode === 8 || keyCode === 13){
         return true;
      //anything else
      }else{
         return false;
      }
   }

   function runSearch(){
      newSearchResults = getSearchResults();
      if(newSearchResults != prevSearchResults){
         prevSearchResults = newSearchResults;
         addPagination(newSearchResults);
      }
   }

   //iterates over every student object in data and checks to see if
   //lower case search text is a substring match for any lower case title + name
   function getSearchResults(){
      let searchText = document.querySelector('#search').value.toLowerCase();
      let newStudents = [];
      for(const student in data){
         let name = data[student].name;
         let s = `${name.title} ${name.first} ${name.last}`;
         if(s.toLowerCase().indexOf(searchText) != -1){
            newStudents.push(data[student]);
         }
      }
      return newStudents;
   }

   //event listeners
   //key strokes
   searchContainer.addEventListener('keyup', (e) => {
      if( isValidKey(e.keyCode) ){
         runSearch();
      }
   });
   //search click
   let searchIcon = document.querySelector('img');
   searchIcon.addEventListener("click", (e) => {
      runSearch();
   });

};

// Call functions
addPagination(data);
addSearch(data);