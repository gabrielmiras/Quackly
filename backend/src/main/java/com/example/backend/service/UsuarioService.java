package com.example.backend.service;

import com.example.backend.model.Usuario;
import com.example.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario salvar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario atualizar(Long id, Usuario novo) {
        Usuario existente = buscarPorId(id);

        existente.setNome(novo.getNome());
        existente.setEmail(novo.getEmail());
        existente.setSenha(novo.getSenha());

        return usuarioRepository.save(existente);
    }

    public void excluir(Long id) {
        usuarioRepository.deleteById(id);
    }
}
