package com.example.backend.controller;

import com.example.backend.dto.MovimentacaoRequest;
import com.example.backend.dto.MovimentacaoResponse;
import com.example.backend.service.MovimentacaoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movimentacoes")
@CrossOrigin(origins = "https://quackly-project.vercel.app")
public class MovimentacaoController {

    @Autowired
    private MovimentacaoService movimentacaoService;

    // GET — listar movimentações de um usuário
    @GetMapping
    public List<MovimentacaoResponse> listarPorUsuario(
            @RequestParam Long idUsuario) {

        return movimentacaoService.listarPorUsuario(idUsuario);
    }

    // POST — cadastrar movimentação
    @PostMapping
    public MovimentacaoResponse criar(
            @RequestBody MovimentacaoRequest request) {

        return movimentacaoService.salvar(request);
    }

    // GET — buscar movimentação por ID e usuário
    @GetMapping("/{id}")
    public MovimentacaoResponse buscar(
            @PathVariable Long id,
            @RequestParam Long idUsuario) {

        return movimentacaoService.buscarPorId(id, idUsuario);
    }

    // PUT — atualizar movimentação
    @PutMapping("/{id}")
    public ResponseEntity<MovimentacaoResponse> atualizar(
            @PathVariable Long id,
            @RequestParam Long idUsuario,
            @RequestBody MovimentacaoRequest request) {

        MovimentacaoResponse atualizada =
                movimentacaoService.atualizar(id, idUsuario, request);

        if (atualizada == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(atualizada);
    }

    // DELETE — excluir movimentação
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @RequestParam Long idUsuario) {

        boolean excluida = movimentacaoService.excluir(id, idUsuario);

        if (!excluida) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

}
