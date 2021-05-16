const { nanoid } = require('nanoid');
const books = require('./books');

/**
 * Kriteria 1 : API dapat menyimpan buku
 */
const addBookHandler = (request, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;

	// Client tidak melampirkan properti name pada request body
	if (!name) {
		const response = h
			.response({
				status: 'fail',
				message: 'Gagal menambahkan buku. Mohon isi nama buku',
			})
			.code(400);
		return response;
	}

	// Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
	if (readPage > pageCount) {
		const response = h
			.response({
				status: 'fail',
				message:
					'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
			})
			.code(400);
		return response;
	}

	const id = nanoid(12);
	const finished = pageCount === readPage;
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;

	const newBook = {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
		id,
		finished,
		insertedAt,
		updatedAt,
	};

	books.push(newBook);

	const isSuccess = books.filter((book) => book.id === id).length > 0;

	if (isSuccess) {
		const response = h
			.response({
				status: 'success',
				message: 'Buku berhasil ditambahkan',
				data: {
					bookId: id,
				},
			})
			.code(201);
		return response;
	}

	const response = h
		.response({
			status: 'error',
			message: 'Buku gagal ditambahkan',
		})
		.code(500);
	return response;
};

/**
 * Kriteria 2 : API dapat menampilkan seluruh buku
 */
const getAllBooksHandler = (request, h) => {
	const { name, reading, finished } = request.query;
	let booksFiltered = [...books];

	if (name) {
		booksFiltered = booksFiltered.filter((book) =>
			book.name.match(new RegExp(name, 'i'))
		);
	} else if (reading) {
		const condition = Boolean(reading == 1);
		booksFiltered = booksFiltered.filter((book) => book.reading === condition);
	} else if (finished) {
		const condition = Boolean(finished == 1);
		booksFiltered = booksFiltered.filter((book) => book.finished === condition);
	}

	const response = h
		.response({
			status: 'success',
			data: {
				books: false
					? booksFiltered
					: booksFiltered.map((book) => ({
							id: book.id,
							name: book.name,
							publisher: book.publisher,
					  })),
			},
		})
		.code(200);
	return response;
};

/**
 * Kriteria 3 : API dapat menampilkan detail buku (by id)
 */
const getNoteByIdHandler = (request, h) => {
	const { bookId } = request.params;
	const book = books.filter((book) => book.id === bookId)[0];

	if (book !== undefined) {
		const response = h
			.response({
				status: 'success',
				data: {
					book,
				},
			})
			.code(200);
		return response;
	}

	const response = h
		.response({
			status: 'fail',
			message: 'Buku tidak ditemukan',
		})
		.code(404);
	return response;
};

/**
 * Kriteria 4 : API dapat mengubah data buku
 */
const editBookByIdHandler = (request, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;

	const finished = pageCount === readPage;
	const updatedAt = new Date().toISOString();

	// Client tidak melampirkan properti name pada request body
	if (!name) {
		const response = h
			.response({
				status: 'fail',
				message: 'Gagal memperbarui buku. Mohon isi nama buku',
			})
			.code(400);
		return response;
	}

	// Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
	if (readPage > pageCount) {
		const response = h
			.response({
				status: 'fail',
				message:
					'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
			})
			.code(400);
		return response;
	}

	const { bookId } = request.params;
	const index = books.findIndex((book) => book.id === bookId);
	if (index !== -1) {
		books[index] = {
			...books[index],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading,
			finished,
			updatedAt,
		};
		const response = h
			.response({
				status: 'success',
				message: 'Buku berhasil diperbarui',
			})
			.code(200);
		return response;
	}
	const response = h
		.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Id tidak ditemukan',
		})
		.code(404);
	return response;
};

/**
 * Kriteria 5 : API dapat menghapus buku
 */
const deleteBookByIdHandler = (request, h) => {
	const { bookId } = request.params;

	const index = books.findIndex((book) => book.id === bookId);

	if (index !== -1) {
		books.splice(index, 1);
		const response = h
			.response({
				status: 'success',
				message: 'Buku berhasil dihapus',
			})
			.code(200);
		return response;
	}

	const response = h
		.response({
			status: 'fail',
			message: 'Buku gagal dihapus. Id tidak ditemukan',
		})
		.code(404);
	return response;
};

module.exports = {
	addBookHandler,
	getAllBooksHandler,
	getNoteByIdHandler,
	editBookByIdHandler,
	deleteBookByIdHandler,
};
