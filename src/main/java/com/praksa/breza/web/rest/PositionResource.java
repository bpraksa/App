package com.praksa.breza.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.praksa.breza.domain.Position;
import com.praksa.breza.repository.PositionRepository;
import com.praksa.breza.web.rest.errors.BadRequestAlertException;
import com.praksa.breza.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Position.
 */
@RestController
@RequestMapping("/api")
public class PositionResource {

    private final Logger log = LoggerFactory.getLogger(PositionResource.class);

    private static final String ENTITY_NAME = "position";

    private final PositionRepository positionRepository;

    public PositionResource(PositionRepository positionRepository) {
        this.positionRepository = positionRepository;
    }

    /**
     * POST  /positions : Create a new position.
     *
     * @param position the position to create
     * @return the ResponseEntity with status 201 (Created) and with body the new position, or with status 400 (Bad Request) if the position has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/positions")
    @Timed
    public ResponseEntity<Position> createPosition(@Valid @RequestBody Position position) throws URISyntaxException {
        log.debug("REST request to save Position : {}", position);
        if (position.getId() != null) {
            throw new BadRequestAlertException("A new position cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Position result = positionRepository.save(position);
        return ResponseEntity.created(new URI("/api/positions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /positions : Updates an existing position.
     *
     * @param position the position to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated position,
     * or with status 400 (Bad Request) if the position is not valid,
     * or with status 500 (Internal Server Error) if the position couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/positions")
    @Timed
    public ResponseEntity<Position> updatePosition(@Valid @RequestBody Position position) throws URISyntaxException {
        log.debug("REST request to update Position : {}", position);
        if (position.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Position result = positionRepository.save(position);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, position.getId().toString()))
            .body(result);
    }

    /**
     * GET  /positions : get all the positions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of positions in body
     */
    @GetMapping("/positions")
    @Timed
    public List<Position> getAllPositions() {
        log.debug("REST request to get all Positions");
        return positionRepository.findAll();
    }

    /**
     * GET  /positions/:id : get the "id" position.
     *
     * @param id the id of the position to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the position, or with status 404 (Not Found)
     */
    @GetMapping("/positions/{id}")
    @Timed
    public ResponseEntity<Position> getPosition(@PathVariable Long id) {
        log.debug("REST request to get Position : {}", id);
        Optional<Position> position = positionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(position);
    }

    /**
     * DELETE  /positions/:id : delete the "id" position.
     *
     * @param id the id of the position to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/positions/{id}")
    @Timed
    public ResponseEntity<Void> deletePosition(@PathVariable Long id) {
        log.debug("REST request to delete Position : {}", id);

        positionRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
