const supabase = require('../config/supabaseClient');

async function getAllMentors() {
  const { data, error } = await supabase
    .from('mentors')
    .select('*');

  if (error) throw error;
  return data;
}

async function addMentor(mentor) {
  const { data, error } = await supabase
    .from('mentors')
    .insert([mentor])
    .select();

  if (error) throw error;
  return data;
}

module.exports = {
  getAllMentors,
  addMentor
};