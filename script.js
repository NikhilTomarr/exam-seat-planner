let classrooms = [];

// store values 
const classroomForm = document.getElementById('classroomForm');

classroomForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // get values from form
    const roomId = document.getElementById('roomId').value;
    const capacity = parseInt(document.getElementById('capacity').value);
    const floorNo = parseInt(document.getElementById('floorNo').value);
    const nearWashroom = document.getElementById('nearWashroom').value === 'true';
    
    // check dublicate values
    const exists = classrooms.find(room => room.roomId === roomId);
    if (exists) {
        alert('Room ID already exists! Please use different ID.');
        return;
    }
    
    // create classroom
    const classroom = {
        roomId: roomId,
        capacity: capacity,
        floorNo: floorNo,
        nearWashroom: nearWashroom
    };

    classrooms.push(classroom);
    classroomForm.reset();
    displayClassrooms();
    alert('Classroom added successfully!');
});

// output function
function displayClassrooms() {
    const listDiv = document.getElementById('classroomList');
    
    if (classrooms.length === 0) {
        listDiv.innerHTML = '<p class="no-data">No classrooms added yet.</p>';
        return;
    }
    
    let html = '';
    
    for (let i = 0; i < classrooms.length; i++) {
        const room = classrooms[i];
        html += `
            <div class="classroom-card">
                <div class="classroom-info">
                    <p><span>Room ID:</span> ${room.roomId}</p>
                    <p><span>Capacity:</span> ${room.capacity} seats</p>
                    <p><span>Floor:</span> ${room.floorNo}</p>
                    <p><span>Near Washroom:</span> ${room.nearWashroom ? 'Yes' : 'No'}</p>
                </div>
                <button class="btn btn-delete" onclick="deleteClassroom('${room.roomId}')">Delete</button>
            </div>
        `;
    }
    
    listDiv.innerHTML = html;
}

// remove 
function deleteClassroom(roomId) {
    classrooms = classrooms.filter(room => room.roomId !== roomId);
    displayClassrooms();
}

// main function
function allocateExam() {
    const totalStudents = parseInt(document.getElementById('totalStudents').value);
    const outputDiv = document.getElementById('outputPanel');
    
    if (!totalStudents || totalStudents <= 0) {
        outputDiv.innerHTML = '<p class="error-message">Please enter valid number of students!</p>';
        return;
    }
    
    // check exist classrooms
    if (classrooms.length === 0) {
        outputDiv.innerHTML = '<p class="error-message">No classrooms available! Please add classrooms first.</p>';
        return;
    }
    
    // calculate capacity
    let totalCapacity = 0;
    for (let i = 0; i < classrooms.length; i++) {
        totalCapacity += classrooms[i].capacity;
    }
    
    // check enough seats
    if (totalCapacity < totalStudents) {
        outputDiv.innerHTML = '<p class="error-message">Not enough seats available! Total capacity: ' + totalCapacity + ' seats</p>';
        return;
    }
    
    let sortedRooms = [...classrooms];
    sortedRooms.sort(function(a, b) {
        if (a.floorNo !== b.floorNo) {
            return a.floorNo - b.floorNo; // use lower floor first
        }
        return b.capacity - a.capacity; // use higher seat room first
    });
    
    // select minimum rooms
    let allocatedRooms = [];
    let seatsAllocated = 0;
    let remainingStudents = totalStudents;
    
    for (let i = 0; i < sortedRooms.length; i++) {
        if (seatsAllocated >= totalStudents) {
            break;
        }
        
        const room = sortedRooms[i];
        const seatsUsed = Math.min(room.capacity, remainingStudents);
        
        allocatedRooms.push({
            roomId: room.roomId,
            capacity: room.capacity,
            floorNo: room.floorNo,
            nearWashroom: room.nearWashroom,
            seatsUsed: seatsUsed
        });
        seatsAllocated += seatsUsed;
        remainingStudents -= seatsUsed;
    }
    
    // show result
    let html = `
        <div class="success-message">
            Seats allocated successfully!
        </div>
        <div class="summary">
            <p><strong>Total Students:</strong> ${totalStudents}</p>
            <p><strong>Rooms Allocated:</strong> ${allocatedRooms.length}</p>
            <p><strong>Total Seats Used:</strong> ${seatsAllocated}</p>
        </div>
        <h3 style="margin-bottom: 10px;">Allocated Classrooms:</h3>
    `;
    
    for (let i = 0; i < allocatedRooms.length; i++) {
        const room = allocatedRooms[i];
        html += `
            <div class="allocation-card">
                <p><strong>Room ${i + 1}:</strong> ${room.roomId}</p>
                <p>Floor: ${room.floorNo} | Capacity: ${room.capacity} | Seats Used: ${room.seatsUsed}</p>
                <p>Near Washroom: ${room.nearWashroom ? 'Yes' : 'No'}</p>
            </div>
        `;
    }
    
    outputDiv.innerHTML = html;
}