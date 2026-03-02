const supabase = require('../config/supabaseClient');

async function getAllStartups() {
  const { data, error } = await supabase
    .from('startups')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw error;
  return data;
}

async function addStartup(startup) {
  const { data, error } = await supabase
    .from('startups')
    .insert([startup])
    .select();

  if (error) throw error;
  return data;
}

module.exports = {
  getAllStartups,
  addStartup
};