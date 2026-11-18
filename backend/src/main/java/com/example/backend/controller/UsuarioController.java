package com.example.backend.controller;

import com.example.backend.model.Usuario;
import com.example.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // GET — listar todos
    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioService.listarTodos();
    }

    // POST — cadastrar
    @PostMapping
    public Usuario criar(@RequestBody Usuario usuario) {
        return usuarioService.salvar(usuario);
    }

    // PUT — atualizar
    @PutMapping("/{id}")
    public Usuario atualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        return usuarioService.atualizar(id, usuario);
    }

    // DELETE — excluir
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        usuarioService.excluir(id);
    }

    // GET por ID
    @GetMapping("/{id}")
    public Usuario buscar(@PathVariable Long id) {
        return usuarioService.buscarPorId(id);
    }

    // POST — login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        Usuario usuarioAutenticado = usuarioService.login(usuario.getEmail(), usuario.getSenha());
        if (usuarioAutenticado != null) {
            return ResponseEntity.ok(usuarioAutenticado);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha incorretos.");
    }
}
