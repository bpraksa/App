package com.praksa.breza.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.praksa.breza.domain.OnlineOrderItem;
import com.praksa.breza.repository.OnlineOrderItemRepository;
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
 * REST controller for managing OnlineOrderItem.
 */
@RestController
@RequestMapping("/api")
public class OnlineOrderItemResource {

    private final Logger log = LoggerFactory.getLogger(OnlineOrderItemResource.class);

    private static final String ENTITY_NAME = "onlineOrderItem";

    private final OnlineOrderItemRepository onlineOrderItemRepository;

    public OnlineOrderItemResource(OnlineOrderItemRepository onlineOrderItemRepository) {
        this.onlineOrderItemRepository = onlineOrderItemRepository;
    }

    /**
     * POST  /online-order-items : Create a new onlineOrderItem.
     *
     * @param onlineOrderItem the onlineOrderItem to create
     * @return the ResponseEntity with status 201 (Created) and with body the new onlineOrderItem, or with status 400 (Bad Request) if the onlineOrderItem has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/online-order-items")
    @Timed
    public ResponseEntity<OnlineOrderItem> createOnlineOrderItem(@Valid @RequestBody OnlineOrderItem onlineOrderItem) throws URISyntaxException {
        log.debug("REST request to save OnlineOrderItem : {}", onlineOrderItem);
        if (onlineOrderItem.getId() != null) {
            throw new BadRequestAlertException("A new onlineOrderItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OnlineOrderItem result = onlineOrderItemRepository.save(onlineOrderItem);
        return ResponseEntity.created(new URI("/api/online-order-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /online-order-items : Updates an existing onlineOrderItem.
     *
     * @param onlineOrderItem the onlineOrderItem to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated onlineOrderItem,
     * or with status 400 (Bad Request) if the onlineOrderItem is not valid,
     * or with status 500 (Internal Server Error) if the onlineOrderItem couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/online-order-items")
    @Timed
    public ResponseEntity<OnlineOrderItem> updateOnlineOrderItem(@Valid @RequestBody OnlineOrderItem onlineOrderItem) throws URISyntaxException {
        log.debug("REST request to update OnlineOrderItem : {}", onlineOrderItem);
        if (onlineOrderItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        OnlineOrderItem result = onlineOrderItemRepository.save(onlineOrderItem);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, onlineOrderItem.getId().toString()))
            .body(result);
    }

    /**
     * GET  /online-order-items : get all the onlineOrderItems.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of onlineOrderItems in body
     */
    @GetMapping("/online-order-items")
    @Timed
    public List<OnlineOrderItem> getAllOnlineOrderItems() {
        log.debug("REST request to get all OnlineOrderItems");
        return onlineOrderItemRepository.findAll();
    }

    /**
     * GET  /online-order-items/:id : get the "id" onlineOrderItem.
     *
     * @param id the id of the onlineOrderItem to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the onlineOrderItem, or with status 404 (Not Found)
     */
    @GetMapping("/online-order-items/{id}")
    @Timed
    public ResponseEntity<OnlineOrderItem> getOnlineOrderItem(@PathVariable Long id) {
        log.debug("REST request to get OnlineOrderItem : {}", id);
        Optional<OnlineOrderItem> onlineOrderItem = onlineOrderItemRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(onlineOrderItem);
    }

    /**
     * DELETE  /online-order-items/:id : delete the "id" onlineOrderItem.
     *
     * @param id the id of the onlineOrderItem to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/online-order-items/{id}")
    @Timed
    public ResponseEntity<Void> deleteOnlineOrderItem(@PathVariable Long id) {
        log.debug("REST request to delete OnlineOrderItem : {}", id);

        onlineOrderItemRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
