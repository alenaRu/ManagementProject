enum StudentInfoField {
  surname      = 'surname' as any,
  name         = 'name' as any,
  patronymic   = 'patronymic' as any,
  
  phone        = 'phone' as any,
  passport     = 'passport' as any,
  
  admisionYear = 'admisionYear' as any,
  bdate        = 'bdate' as any,
  
  institute    = 'institute' as any,
  speciality   = 'speciality' as any,
  
  room         = 'room' as any,
  notes        = 'notes' as any
  
}

export const
  {
    surname,
    name,
    patronymic,
    
    phone,
    passport,
    
    admisionYear,
    bdate,
    
    institute,
    speciality,
    
    room,
    notes
  } = StudentInfoField;

export default StudentInfoField;
