package com.example.backend.repository;

import com.example.backend.model.Movimentacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {

    List<Movimentacao> findByUsuarioId(Long idUsuario);

    Optional<Movimentacao> findByIdMovimentacaoAndUsuarioId(
            Long idMovimentacao,
            Long idUsuario
    );
}
