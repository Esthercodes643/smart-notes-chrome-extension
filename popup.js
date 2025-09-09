document.addEventListener("DOMContentLoaded", () => {
    const noteText = document.getElementById("note-text");
    const saveBtn = document.getElementById("add-note");
    const notesList = document.getElementById("note-list");

    loadNotes();

    saveBtn.addEventListener("click", () => {
        const text = noteText.value.trim();
        if (text) {
            saveNote(text);
            noteText.value = "";
            loadNotes();
        }
    });

    function saveNote(text) {
        chrome.storage.local.get({ notes: [] }, (result) => {
            const notes = result.notes || [];
            const newNote = {
                id: Date.now(),
                text: text,
                date: new Date().toLocaleString(),
            };
            notes.unshift(newNote);
            chrome.storage.local.set({ notes: notes }, () => {
                loadNotes();
            });
        });
    }

    function loadNotes() {
        chrome.storage.local.get(["notes"], (result) => {
            const notes = result.notes || [];
            notesList.innerHTML = "";
            if (notes.length === 0) {
                notesList.innerHTML = "<div class='no-notes'>No notes yet. Create one.</div>";
                return;
            }

            notes.forEach((note) => {
                const noteItem = document.createElement("div");
                noteItem.className = "note-item";
                noteItem.innerHTML = `
                    <div class="note-text">${note.text}</div>
                    <div class="note-date">${note.date}</div>
                    <button class="delete-btn" data-id="${note.id}">Delete</button>
                `;
                notesList.appendChild(noteItem);
            });

            document.querySelectorAll(".delete-btn").forEach((btn) => {
                btn.addEventListener("click", function () {
                    const noteId = Number.parseInt(this.getAttribute("data-id"));
                    deleteNote(noteId);
                });
            });
        });
    }

    function deleteNote(id) {
        chrome.storage.local.get(["notes"], (result) => {
            const notes = result.notes || [];
            const updatedNotes = notes.filter((note) => note.id !== id);
            chrome.storage.local.set({ notes: updatedNotes }, () => {
                loadNotes();
            });
        });
    }
});