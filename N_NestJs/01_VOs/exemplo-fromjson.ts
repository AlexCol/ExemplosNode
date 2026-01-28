// import { Usuario } from './src/entities/usuario.entity';

// // 🎯 EXEMPLOS DE USO DO fromJson

// console.log('=== Exemplo fromJson ===\n');

// // 1. Dados vindos de uma API ou banco de dados
// const jsonData = {
//   id: 1,
//   nome: 'João Silva',
//   email: 'joao@email.com',
//   sobreNome: 'Silva',
//   idade: 25,
// };

// try {
//   // ✅ Usando fromJson - cria VOs automaticamente
//   const usuario1 = Usuario.fromJson(jsonData);

//   console.log('👤 Usuario criado com fromJson:');
//   console.log('- ID:', usuario1.id);
//   console.log('- Nome VO:', usuario1.nome.getValue());
//   console.log('- Email VO:', usuario1.email.getValue());
//   console.log('- Idade VO:', usuario1.idade.getValue());
//   console.log('- toJson():', usuario1.toJson());
// } catch (error) {
//   console.error('❌ Erro:', error.message);
// }

// console.log('\n=== Exemplo create (alternativo) ===\n');

// try {
//   // ✅ Usando método create (mais explícito)
//   const usuario2 = Usuario.create(jsonData);

//   console.log('👤 Usuario criado com create:');
//   console.log('- toJson():', usuario2.toJson());
// } catch (error) {
//   console.error('❌ Erro:', error.message);
// }

// console.log('\n=== Exemplo com dados inválidos ===\n');

// const dadosInvalidos = {
//   id: 2,
//   nome: '', // Nome vazio - inválido
//   email: 'email-invalido', // Email mal formado
//   idade: -5, // Idade negativa
// };

// try {
//   const usuarioInvalido = Usuario.fromJson(dadosInvalidos);
//   console.log(
//     '⚠️ Usuario com dados inválidos criado (VOs podem falhar na validação)',
//   );
// } catch (error) {
//   console.error('❌ Erro esperado:', error.message);
// }

// console.log('\n=== Exemplo: JSON → toJson() → fromJson() (Round-trip) ===\n');

// try {
//   // Cria usuario original
//   const original = Usuario.create({
//     id: 3,
//     nome: 'Maria Santos',
//     email: 'maria@email.com',
//     idade: 30,
//   });

//   // Serializa para JSON
//   const serializado = original.toJson();
//   console.log('🔄 JSON serializado:', serializado);

//   // Desserializa de volta
//   const reconstruido = Usuario.fromJson(serializado);
//   console.log('🔄 Objeto reconstruído:', reconstruido.toJson());

//   // Verifica se são iguais
//   const saoIguais =
//     JSON.stringify(original.toJson()) === JSON.stringify(reconstruido.toJson());
//   console.log('✅ Round-trip bem-sucedido:', saoIguais);
// } catch (error) {
//   console.error('❌ Erro no round-trip:', error.message);
// }
