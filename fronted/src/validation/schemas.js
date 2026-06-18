// Añadir al final de schemas.js
export const movieSchema = yup.object({
  title: yup.string().trim().required('El título es requerido'),
  synopsis: yup.string().trim().required('La sinopsis es requerida'),
  genre: yup.string().trim().required('El género es requerido'),
  duration: yup.number().positive('Debe ser positivo').integer().required('La duración es requerida'),
  classification: yup.string().oneOf(['+14', 'R', 'Todo público']).required('Clasificación requerida'),
})

export const roomSchema = yup.object({
  name: yup.string().trim().required('El nombre de la sala es requerido'),
  rows_count: yup.number().positive().integer().required('Las filas son requeridas'),
  columns_count: yup.number().positive().integer().required('Las columnas son requeridas'),
})

export const showtimeSchema = yup.object({
  movie_id: yup.number().required('Selecciona una película'),
  room_id: yup.number().required('Selecciona una sala'),
  datetime: yup.date().required('La fecha y hora son requeridas'),
  price: yup.number().positive('El precio debe ser mayor a 0').required('El precio es requerido'),
})