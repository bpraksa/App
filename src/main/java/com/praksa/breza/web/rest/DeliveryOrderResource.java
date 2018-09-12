package com.praksa.breza.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.praksa.breza.domain.DeliveryOrder;
import com.praksa.breza.repository.DeliveryOrderRepository;
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
 * REST controller for managing DeliveryOrder.
 */
@RestController
@RequestMapping("/api")
public class DeliveryOrderResource {

    private final Logger log = LoggerFactory.getLogger(DeliveryOrderResource.class);

    private static final String ENTITY_NAME = "deliveryOrder";

    private final DeliveryOrderRepository deliveryOrderRepository;

    public DeliveryOrderResource(DeliveryOrderRepository deliveryOrderRepository) {
        this.deliveryOrderRepository = deliveryOrderRepository;
    }

    /**
     * POST  /delivery-orders : Create a new deliveryOrder.
     *
     * @param deliveryOrder the deliveryOrder to create
     * @return the ResponseEntity with status 201 (Created) and with body the new deliveryOrder, or with status 400 (Bad Request) if the deliveryOrder has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/delivery-orders")
    @Timed
    public ResponseEntity<DeliveryOrder> createDeliveryOrder(@Valid @RequestBody DeliveryOrder deliveryOrder) throws URISyntaxException {
        log.debug("REST request to save DeliveryOrder : {}", deliveryOrder);
        if (deliveryOrder.getId() != null) {
            throw new BadRequestAlertException("A new deliveryOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DeliveryOrder result = deliveryOrderRepository.save(deliveryOrder);
        return ResponseEntity.created(new URI("/api/delivery-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /delivery-orders : Updates an existing deliveryOrder.
     *
     * @param deliveryOrder the deliveryOrder to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated deliveryOrder,
     * or with status 400 (Bad Request) if the deliveryOrder is not valid,
     * or with status 500 (Internal Server Error) if the deliveryOrder couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/delivery-orders")
    @Timed
    public ResponseEntity<DeliveryOrder> updateDeliveryOrder(@Valid @RequestBody DeliveryOrder deliveryOrder) throws URISyntaxException {
        log.debug("REST request to update DeliveryOrder : {}", deliveryOrder);
        if (deliveryOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        DeliveryOrder result = deliveryOrderRepository.save(deliveryOrder);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, deliveryOrder.getId().toString()))
            .body(result);
    }

    /**
     * GET  /delivery-orders : get all the deliveryOrders.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of deliveryOrders in body
     */
    @GetMapping("/delivery-orders")
    @Timed
    public List<DeliveryOrder> getAllDeliveryOrders() {
        log.debug("REST request to get all DeliveryOrders");
        return deliveryOrderRepository.findAll();
    }

    /**
     * GET  /delivery-orders/:id : get the "id" deliveryOrder.
     *
     * @param id the id of the deliveryOrder to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the deliveryOrder, or with status 404 (Not Found)
     */
    @GetMapping("/delivery-orders/{id}")
    @Timed
    public ResponseEntity<DeliveryOrder> getDeliveryOrder(@PathVariable Long id) {
        log.debug("REST request to get DeliveryOrder : {}", id);
        Optional<DeliveryOrder> deliveryOrder = deliveryOrderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(deliveryOrder);
    }

    /**
     * DELETE  /delivery-orders/:id : delete the "id" deliveryOrder.
     *
     * @param id the id of the deliveryOrder to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/delivery-orders/{id}")
    @Timed
    public ResponseEntity<Void> deleteDeliveryOrder(@PathVariable Long id) {
        log.debug("REST request to delete DeliveryOrder : {}", id);

        deliveryOrderRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
