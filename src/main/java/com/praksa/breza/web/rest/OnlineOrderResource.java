package com.praksa.breza.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.praksa.breza.domain.OnlineOrder;
import com.praksa.breza.repository.OnlineOrderRepository;
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
 * REST controller for managing OnlineOrder.
 */
@RestController
@RequestMapping("/api")
public class OnlineOrderResource {

    private final Logger log = LoggerFactory.getLogger(OnlineOrderResource.class);

    private static final String ENTITY_NAME = "onlineOrder";

    private final OnlineOrderRepository onlineOrderRepository;

    public OnlineOrderResource(OnlineOrderRepository onlineOrderRepository) {
        this.onlineOrderRepository = onlineOrderRepository;
    }

    /**
     * POST  /online-orders : Create a new onlineOrder.
     *
     * @param onlineOrder the onlineOrder to create
     * @return the ResponseEntity with status 201 (Created) and with body the new onlineOrder, or with status 400 (Bad Request) if the onlineOrder has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/online-orders")
    @Timed
    public ResponseEntity<OnlineOrder> createOnlineOrder(@Valid @RequestBody OnlineOrder onlineOrder) throws URISyntaxException {
        log.debug("REST request to save OnlineOrder : {}", onlineOrder);
        if (onlineOrder.getId() != null) {
            throw new BadRequestAlertException("A new onlineOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OnlineOrder result = onlineOrderRepository.save(onlineOrder);
        return ResponseEntity.created(new URI("/api/online-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /online-orders : Updates an existing onlineOrder.
     *
     * @param onlineOrder the onlineOrder to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated onlineOrder,
     * or with status 400 (Bad Request) if the onlineOrder is not valid,
     * or with status 500 (Internal Server Error) if the onlineOrder couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/online-orders")
    @Timed
    public ResponseEntity<OnlineOrder> updateOnlineOrder(@Valid @RequestBody OnlineOrder onlineOrder) throws URISyntaxException {
        log.debug("REST request to update OnlineOrder : {}", onlineOrder);
        if (onlineOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        OnlineOrder result = onlineOrderRepository.save(onlineOrder);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, onlineOrder.getId().toString()))
            .body(result);
    }

    /**
     * GET  /online-orders : get all the onlineOrders.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of onlineOrders in body
     */
    @GetMapping("/online-orders")
    @Timed
    public List<OnlineOrder> getAllOnlineOrders() {
        log.debug("REST request to get all OnlineOrders");
        return onlineOrderRepository.findAll();
    }

    /**
     * GET  /online-orders/:id : get the "id" onlineOrder.
     *
     * @param id the id of the onlineOrder to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the onlineOrder, or with status 404 (Not Found)
     */
    @GetMapping("/online-orders/{id}")
    @Timed
    public ResponseEntity<OnlineOrder> getOnlineOrder(@PathVariable Long id) {
        log.debug("REST request to get OnlineOrder : {}", id);
        Optional<OnlineOrder> onlineOrder = onlineOrderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(onlineOrder);
    }

    /**
     * DELETE  /online-orders/:id : delete the "id" onlineOrder.
     *
     * @param id the id of the onlineOrder to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/online-orders/{id}")
    @Timed
    public ResponseEntity<Void> deleteOnlineOrder(@PathVariable Long id) {
        log.debug("REST request to delete OnlineOrder : {}", id);

        onlineOrderRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
